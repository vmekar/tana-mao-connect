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

export interface InboxItem {
  listingId: string;
  listingTitle: string;
  messages: {
    id: string;
    content: string;
    senderName: string;
    createdAt: string;
  }[];
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

  async updateProfile(userId: string, data: Partial<Profile>): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', userId);

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
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

  async fetchInbox(userId: string): Promise<InboxItem[]> {
    // Fetch messages where user is receiver
    const { data: messages, error } = await supabase
      .from('messages')
      .select(`
        id,
        content,
        created_at,
        listing_id,
        sender_id,
        listings:listing_id (
          title
        ),
        profiles:sender_id (
          full_name
        )
      `)
      .eq('receiver_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching inbox:', error);
      throw error;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const grouped = messages.reduce((acc: Record<string, InboxItem>, msg: any) => {
      const listingId = msg.listing_id;
      if (!acc[listingId]) {
        acc[listingId] = {
          listingId,
          listingTitle: msg.listings?.title || 'Anúncio indisponível',
          messages: [],
        };
      }

      acc[listingId].messages.push({
        id: msg.id,
        content: msg.content,
        senderName: msg.profiles?.full_name || 'Usuário',
        createdAt: msg.created_at,
      });

      return acc;
    }, {});

    return Object.values(grouped);
  },
};
