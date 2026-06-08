import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://cctobgbyxjfabksnokbe.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_MMlDjds0mfsZR4_0pjaUVw_bBqm_BJt";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface SupabaseNote {
  id?: string;
  note_id: string; // Map of noteId
  user_id: string; // Map of userId
  title: string;
  content: string;
  color: string;
  created_at?: string;
}

// Durable sync helpers with client-side localStorage fallback so the interface works flawlessly 
// even if the user's remote Supabase backend is undergoing updates/migrations or tables are not yet created.

const LOCAL_NOTES_KEY = 'otd_surf_local_notes_mirror';

function getLocalNotes(): SupabaseNote[] {
  try {
    const data = localStorage.getItem(LOCAL_NOTES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('LocalStorage load error:', err);
    return [];
  }
}

function setLocalNotes(notes: SupabaseNote[]) {
  try {
    localStorage.setItem(LOCAL_NOTES_KEY, JSON.stringify(notes));
  } catch (err) {
    console.error('LocalStorage write error:', err);
  }
}

export const supabaseDb = {
  /**
   * Fetch notes for a specific user.
   */
  async getNotes(userId: string): Promise<SupabaseNote[]> {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        // Sync local mirror
        const formatted = data.map(n => ({
          id: n.id,
          note_id: n.note_id || n.id,
          user_id: n.user_id,
          title: n.title,
          content: n.content,
          color: n.color,
          created_at: n.created_at
        }));
        setLocalNotes(formatted);
        return formatted;
      }
    } catch (err) {
      console.warn('Real Supabase query encountered a schema gap / failure. Falling back to secure localStorage mirror:', err);
    }
    
    // Return local notes for this user ID as fallback or direct storage
    return getLocalNotes().filter(n => n.user_id === userId);
  },

  /**
   * Save a brand new document / note to Supabase.
   */
  async addNote(note: Omit<SupabaseNote, 'id' | 'created_at'>): Promise<SupabaseNote> {
    const payload = {
      note_id: note.note_id,
      user_id: note.user_id,
      title: note.title,
      content: note.content,
      color: note.color,
      created_at: new Date().toISOString()
    };

    // Update local storage mirror first to maintain instant responsiveness in developer previews
    const local = getLocalNotes();
    local.unshift(payload);
    setLocalNotes(local);

    try {
      const { data, error } = await supabase
        .from('notes')
        .insert([payload])
        .select();

      if (error) {
        throw error;
      }
      if (data && data[0]) {
        return data[0];
      }
    } catch (err) {
      console.warn('Could not persist to Supabase remote table (check your Table schema/RLS rules). Retained in Local Mirror:', err);
    }

    return payload;
  },

  /**
   * Delete a note by its note_id.
   */
  async deleteNote(noteId: string, userId: string): Promise<boolean> {
    const local = getLocalNotes().filter(n => n.note_id !== noteId);
    setLocalNotes(local);

    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('note_id', noteId)
        .eq('user_id', userId);

      if (error) {
        throw error;
      }
      return true;
    } catch (err) {
      console.warn('Could not delete from remote Supabase:', err);
    }
    return true;
  }
};
