import { useState, useEffect, useRef } from 'react';
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

  // Au montage : charger depuis Supabase si disponible
  useEffect(() => {
    const loadFromSupabase = async () => {
      if (!isSupabaseConfigured || !tableName) {
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
          // Mettre à jour localStorage aussi
          window.localStorage.setItem(key, JSON.stringify(loadedData));
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
      
      // Synchroniser avec Supabase en arrière-plan si disponible
      if (isSupabaseConfigured && tableName) {
        syncWithSupabase(tableName, state, previousStateRef.current);
      }
      
      previousStateRef.current = state;
    } catch (error) {
      console.error('Erreur localStorage:', error);
    }
  }, [state, key, tableName]);

  return [state, setState];
};

/**
 * Synchronise les changements d'état avec Supabase
 * Détecte les ajouts, suppressions et modifications
 */
const syncWithSupabase = async <T extends { id: string | number }>(
  tableName: string,
  newState: T[],
  prevState: T[]
) => {
  if (!supabase) return;

  const newIds = new Set(newState.map(item => item.id));
  const prevIds = new Set(prevState.map(item => item.id));

  // Déterminer les changements
  const added = newState.filter(item => !prevIds.has(item.id));
  const deleted = prevState.filter(item => !newIds.has(item.id));
  const updated = newState.filter(item => 
    prevIds.has(item.id) && 
    JSON.stringify(item) !== JSON.stringify(prevState.find(p => p.id === item.id))
  );

  // Insérer les nouveaux éléments
  if (added.length > 0) {
    const { error } = await supabase
      .from(tableName)
      .insert(added as any);
    
    if (error) {
      console.error(`Erreur lors de l'insertion dans ${tableName}:`, error);
    } else {
      console.log(`✅ ${added.length} élément(s) ajouté(s) à ${tableName}`);
    }
  }

  // Supprimer les éléments supprimés
  if (deleted.length > 0) {
    const deletedIds = deleted.map(item => item.id);
    const { error } = await supabase
      .from(tableName)
      .delete()
      .in('id', deletedIds as any);
    
    if (error) {
      console.error(`Erreur lors de la suppression dans ${tableName}:`, error);
    } else {
      console.log(`✅ ${deleted.length} élément(s) supprimé(s) de ${tableName}`);
    }
  }

  // Mettre à jour les éléments modifiés
  if (updated.length > 0) {
    for (const item of updated) {
      const { error } = await supabase
        .from(tableName)
        .update(item as any)
        .eq('id', item.id);
      
      if (error) {
        console.error(`Erreur lors de la mise à jour de ${tableName} (id: ${item.id}):`, error);
      } 
    }
    console.log(`✅ ${updated.length} élément(s) mis à jour dans ${tableName}`);
  }
};