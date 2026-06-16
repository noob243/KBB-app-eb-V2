import { useState, useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { toCamelCase } from '../lib/utils';

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

  const keyRef = useRef(key);

  useEffect(() => {
    if (!isSupabaseConfigured || !tableName) return;

    const loadFromSupabase = async () => {
      try {
        const { data, error } = await supabase!.from(tableName).select('*');

        if (error) {
          console.error(`⚠️ Supabase [${tableName}]:`, error.message);
          return;
        }

        if (data) {
          const camelData = toCamelCase(data) as T[];
          setState(camelData);
          window.localStorage.setItem(`kbb_supabase_${keyRef.current}`, JSON.stringify(camelData));
          console.log(`✅ ${tableName}: ${data.length} élément(s) chargé(s) depuis Supabase`);
        }
      } catch (err) {
        console.error(`⚠️ Réseau [${tableName}]:`, err);
      }
    };

    loadFromSupabase();
  }, [tableName]);

  useEffect(() => {
    try {
      window.localStorage.setItem(`kbb_supabase_${keyRef.current}`, JSON.stringify(state));
    } catch {}
  }, [state]);

  return [state, setState];
};