import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
}

export interface Message {
  id: string;
  listing_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
}

export const messageService = {
  async fetchSellerProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching seller profile:', error);
      return null;
    }

    return data as Profile;
  },

  async sendMessage(listingId: string, receiverId: string, content: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('messages')
      .insert({
        listing_id: listingId,
        sender_id: user.id,
        receiver_id: receiverId,
        content,
      });

    if (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },
};
