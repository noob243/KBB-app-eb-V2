import { useState, useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Convertit un objet camelCase en snake_case pour Supabase
 */
const toSnakeCase = (obj: any): any => {
  if (obj === null || obj === undefined || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(toSnakeCase);

  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    result[snakeKey] = typeof value === 'object' && value !== null && !(value instanceof Date) && !(value instanceof File)
      ? toSnakeCase(value)
      : value;
  }
  return result;
};

/**
 * Convertit un objet snake_case en camelCase pour le frontend
 */
const toCamelCase = (obj: any): any => {
  if (obj === null || obj === undefined || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(toCamelCase);

  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    result[camelKey] = typeof value === 'object' && value !== null && !(value instanceof Date)
      ? toCamelCase(value)
      : value;
  }
  return result;
};

/**
 * Hook personnalisé pour synchroniser l'état avec Supabase
 * - Convertit automatiquement camelCase ↔ snake_case
 * - Charge les données depuis Supabase au montage
 * - Sauvegarde automatiquement les changements vers Supabase
 * 
 * @param tableName - Nom de la table Supabase
 * @param key - Clé localStorage de secours
 * @param initialValue - Valeur initiale (mockData) - ignorée si Supabase répond
 * @returns [state, setState]
 */
export const useSupabaseSync = <T extends { id: string | number }>(
  tableName: string | null,
  key: string,
  initialValue: T[]
): [T[], React.Dispatch<React.SetStateAction<T[]>>] => {
  const [state, setState] = useState<T[]>(() => {
    try {
      const stored = window.localStorage.getItem(`kbb_supabase_${key}`);
      if (stored) return JSON.parse(stored);
    } catch {}
    return initialValue;
  });

  const isLoadedRef = useRef(false);
  const initialValueRef = useRef(initialValue);
  const keyRef = useRef(key);

  // Au montage : charger depuis Supabase
  useEffect(() => {
    if (!isSupabaseConfigured || !tableName) return;

    const loadFromSupabase = async () => {
      try {
        const { data, error } = await supabase!
          .from(tableName)
          .select('*');

        if (error) {
          console.error(`⚠️ Supabase [${tableName}]:`, error.message);
          return;
        }

        if (data && data.length > 0) {
          // Convertir snake_case (Supabase) → camelCase (frontend)
          const camelData = toCamelCase(data) as T[];
          setState(camelData);
          window.localStorage.setItem(`kbb_supabase_${keyRef.current}`, JSON.stringify(camelData));
          isLoadedRef.current = true;
          console.log(`✅ ${tableName}: ${data.length} élément(s) chargé(s) depuis Supabase`);
        } else {
          // Supabase vide : insérer les données initiales
          isLoadedRef.current = true;
          const init = initialValueRef.current;
          if (init.length > 0) {
            const snakeInit = toSnakeCase(init);
            const { error: insertErr } = await supabase!
              .from(tableName)
              .insert(snakeInit);
            if (insertErr) {
              console.error(`⚠️ Insert initial [${tableName}]:`, insertErr.message);
            } else {
              console.log(`✅ Données initiales insérées dans ${tableName} (${init.length})`);
              setState(init);
              window.localStorage.setItem(`kbb_supabase_${keyRef.current}`, JSON.stringify(init));
            }
          }
        }
        // Marquer comme chargé même en cas d'erreur ou si Supabase/SQL est vide
        // pour permettre les futurs upserts lors des ajouts utilisateur
        isLoadedRef.current = true;
      } catch (err) {
        console.error(`⚠️ Réseau [${tableName}]:`, err);
        // En cas d'erreur réseau, on marque quand même comme chargé
        // pour ne pas bloquer les écritures utilisateur
        isLoadedRef.current = true;
      }
    };

    loadFromSupabase();
  }, [tableName]);

  // Sauvegarder vers localStorage + Supabase à chaque changement
  useEffect(() => {
    try {
      window.localStorage.setItem(`kbb_supabase_${keyRef.current}`, JSON.stringify(state));
    } catch {}

    if (isSupabaseConfigured && tableName && isLoadedRef.current && state.length > 0) {
      const sync = async () => {
        try {
          const snakeData = toSnakeCase(state);
          const { error } = await supabase!
            .from(tableName)
            .upsert(snakeData, { onConflict: 'id' });

          if (error) {
            console.error(`⚠️ Sync [${tableName}]:`, error.message);
          }
        } catch (err) {
          console.error(`⚠️ Sync [${tableName}] error:`, err);
        }
      };
      sync();
    }
  }, [state, tableName]);

  return [state, setState];
};
