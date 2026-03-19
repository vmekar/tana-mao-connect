const API_URL = import.meta.env.VITE_API_URL || '';

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

interface MessageRow {
  id: string;
  content: string;
  created_at: string;
  listing_id: string;
  sender_id: string;
  listings: {
    title: string;
  } | null;
  profiles: {
    full_name: string | null;
  } | null;
}

export const messageService = {
  async fetchSellerProfile(userId: string): Promise<Profile | null> {
    try {
      const response = await fetch(`${API_URL}/profiles/${userId}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to fetch seller profile');
      }

      const data = await response.json();
      return data as Profile;
    } catch (error) {
      console.error('Error fetching seller profile:', error);
      return null;
    }
  },

  async updateProfile(userId: string, data: Partial<Profile>): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/profiles/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update profile');
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  async sendMessage(listingId: string, receiverId: string, content: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listing_id: listingId,
          sender_id: 'mock-user-123', // Static mock user ID
          receiver_id: receiverId,
          content,
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  async fetchInbox(userId: string): Promise<InboxItem[]> {
    try {
      // Fetch messages where user is receiver
      const response = await fetch(`${API_URL}/messages/inbox/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch inbox');

      const data = await response.json();
      const messageRows: MessageRow[] = data.items || [];

      const grouped = messageRows.reduce((acc: Record<string, InboxItem>, msg) => {
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
    } catch (error) {
      console.error('Error fetching inbox:', error);
      throw error;
    }
  },
};
