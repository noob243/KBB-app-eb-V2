import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Hook personnalisé pour synchroniser l'état avec Supabase
 * Sauvegarde automatiquement les données en base de données
 * @param tableName - Nom de la table Supabase
 * @param key - Clé localStorage de secours
 * @param initialValue - Valeur initiale
 * @returns [state, setState]
 */
export const useSupabaseSync = <T extends { id: string | number }>(
  tableName: string | null,
  key: string,
  initialValue: T[]
): [T[], (fn: (prev: T[]) => T[]) => void] => {
  const [state, setState] = useState<T[]>(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const previousStateRef = useRef<T[]>(initialValue);
  const isLoadedFromSupabase = useRef(false);

  // Au montage : charger depuis Supabase si disponible
  useEffect(() => {
    const loadFromSupabase = async () => {
      if (!isSupabaseConfigured || !tableName || isLoadedFromSupabase.current) {
        return;
      }

      try {
        const { data, error } = await supabase!
          .from(tableName)
          .select('*');

        if (error) {
          console.error(`Erreur lors du chargement de ${tableName}:`, error);
          return;
        }

        if (data && data.length > 0) {
          const loadedData = data as T[];
          setState(loadedData);
          previousStateRef.current = loadedData;
          window.localStorage.setItem(key, JSON.stringify(loadedData));
          isLoadedFromSupabase.current = true;
        } else {
          isLoadedFromSupabase.current = true;
          // Si Supabase est vide mais qu'on a des données locales, les insérer
          if (previousStateRef.current.length > 0) {
            const { error: insertError } = await supabase!
              .from(tableName)
              .insert(previousStateRef.current as any);
            if (insertError) {
              console.error(`Erreur lors de l'insertion initiale dans ${tableName}:`, insertError);
            } else {
              console.log(`✅ ${previousStateRef.current.length} élément(s) inséré(s) dans ${tableName}`);
            }
          }
        }
      } catch (err) {
        console.error(`Erreur Supabase pour ${tableName}:`, err);
      }
    };

    loadFromSupabase();
  }, [tableName, key]);

  // Sauvegarder dans localStorage et synchroniser avec Supabase
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
      previousStateRef.current = state;
      
      // Synchroniser avec Supabase en arrière-plan si disponible
      if (isSupabaseConfigured && tableName && isLoadedFromSupabase.current) {
        syncAllToSupabase(tableName, state);
      }
    } catch (error) {
      console.error('Erreur localStorage:', error);
    }
  }, [state, key, tableName]);

  return [state, setState];
};

/**
 * Envoie TOUT l'état actuel à Supabase en faisant un upsert
 * Plus fiable que la détection de différences
 */
const syncAllToSupabase = async <T extends { id: string | number }>(
  tableName: string,
  data: T[]
) => {
  if (!supabase || data.length === 0) return;

  // Upsert : met à jour ou insère chaque élément
  const { error } = await supabase
    .from(tableName)
    .upsert(data as any, { onConflict: 'id' });

  if (error) {
    console.error(`Erreur lors de la synchronisation de ${tableName}:`, error);
  } else {
    console.log(`✅ ${tableName} synchronisé (${data.length} élément(s))`);
  }
};
