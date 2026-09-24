/**
 * Z Collective Pvt Ltd - NewsAgency Membership Data Storage Service
 * Handles persistent client-side storage, Supabase Cloud Database real-time sync, and photo upload.
 */

const LOCAL_STORAGE_KEY = 'Z_COLLECTIVE_NEWSAGENCY_MEMBERS_V1';

const DEFAULT_MEMBERS = [
    {
        id: 'MEM-1001',
        membershipId: 'MEM-1001',
        name: 'Sarah Jenkins',
        phone: '+1 (555) 234-5678',
        photo: 'assets/images/female_avatar.svg',
        joinDate: '2024-01-15',
        tier: 'VIP Gold',
        points: 450,
        notes: 'Daily Times & Magazine subscriber'
    },
    {
        id: 'MEM-1002',
        membershipId: 'MEM-1002',
        name: 'Robert Chen',
        phone: '+1 (555) 876-5432',
        photo: 'assets/images/male_avatar.svg',
        joinDate: '2024-03-22',
        tier: 'Silver Member',
        points: 180,
        notes: 'Weekend Herald & lottery buyer'
    },
    {
        id: 'MEM-1003',
        membershipId: 'MEM-1003',
        name: 'Emily Rodriguez',
        phone: '',
        photo: 'assets/images/female_avatar.svg',
        joinDate: '2024-06-10',
        tier: 'Standard',
        points: 50,
        notes: 'Phone number update pending'
    },
    {
        id: 'MEM-1004',
        membershipId: 'MEM-1004',
        name: 'Marcus Vance',
        phone: '+1 (555) 901-2345',
        photo: 'assets/images/male_avatar.svg',
        joinDate: '2024-08-05',
        tier: 'Platinum',
        points: 890,
        notes: 'Office bulk magazine & stationery account'
    },
    {
        id: 'MEM-1005',
        membershipId: 'MEM-1005',
        name: 'Anita Patel',
        phone: '+1 (555) 345-6789',
        photo: '',
        joinDate: '2024-09-01',
        tier: 'Standard',
        points: 20,
        notes: 'New subscriber'
    }
];

class MemberStorageService {
    constructor() {
        this.cache = [];
        this.onChangeListener = null;
        this.initStorage();
    }

    async initStorage() {
        if (isSupabaseEnabled && supabaseClient) {
            // Initial Fetch from Supabase Cloud Database
            await this.fetchCloudMembers();

            // Real-Time Sync across all staff devices
            try {
                supabaseClient
                    .channel('public:members')
                    .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, payload => {
                        this.fetchCloudMembers();
                    })
                    .subscribe();
            } catch (e) {
                console.warn("Supabase Realtime notice:", e);
            }
        } else {
            this.loadLocalCache();
        }
    }

    async fetchCloudMembers() {
        if (!isSupabaseEnabled || !supabaseClient) return;
        try {
            const { data, error } = await supabaseClient
                .from('members')
                .select('*')
                .order('joinDate', { ascending: false });

            if (error) throw error;

            if (data && data.length > 0) {
                this.cache = data;
                this.setLocalCache(data);
                if (typeof this.onChangeListener === 'function') {
                    this.onChangeListener(this.cache);
                }
            } else {
                // Seed Supabase if table is empty
                await this.seedCloudMembers();
            }
        } catch (e) {
            console.warn("Supabase fetch notice (using local cache):", e.message);
            this.loadLocalCache();
        }
    }

    async seedCloudMembers() {
        if (!isSupabaseEnabled || !supabaseClient) return;
        try {
            const { error } = await supabaseClient
                .from('members')
                .upsert(DEFAULT_MEMBERS, { onConflict: 'membershipId' });
            if (!error) {
                this.cache = DEFAULT_MEMBERS;
                this.setLocalCache(DEFAULT_MEMBERS);
                console.log("✅ Seeded default members to Supabase Cloud Database!");
            }
        } catch (e) {
            console.warn("Supabase seed notice:", e);
        }
    }

    loadLocalCache() {
        try {
            const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (raw) {
                this.cache = JSON.parse(raw);
            } else {
                this.cache = DEFAULT_MEMBERS;
                this.setLocalCache(DEFAULT_MEMBERS);
            }
        } catch (e) {
            this.cache = DEFAULT_MEMBERS;
        }
        if (typeof this.onChangeListener === 'function') {
            this.onChangeListener(this.cache);
        }
    }

    setLocalCache(members) {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(members));
        } catch (e) {
            console.error('Error writing to localStorage cache:', e);
        }
    }

    getAllMembers() {
        return this.cache && this.cache.length > 0 ? this.cache : DEFAULT_MEMBERS;
    }

    getMemberById(membershipId) {
        if (!membershipId) return null;
        const cleanId = membershipId.trim().toUpperCase();
        return this.getAllMembers().find(m => m.membershipId.toUpperCase() === cleanId) || null;
    }

    searchMembers(query) {
        const members = this.getAllMembers();
        if (!query) return members;
        const q = query.trim().toLowerCase();
        return members.filter(m => 
            m.membershipId.toLowerCase().includes(q) ||
            m.name.toLowerCase().includes(q) ||
            (m.phone && m.phone.toLowerCase().includes(q)) ||
            (m.notes && m.notes.toLowerCase().includes(q))
        );
    }

    // Helper: Convert Data URL (Base64) to Blob for Supabase Upload
    dataURLtoBlob(dataurl) {
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }

    async uploadPhotoToCloud(dataUrl, membershipId) {
        if (!isSupabaseEnabled || !supabaseClient || !dataUrl || !dataUrl.startsWith('data:image/')) {
            return dataUrl;
        }
        try {
            const cleanId = membershipId.trim().toUpperCase();
            const fileName = `${cleanId}_${Date.now()}.jpg`;
            const blob = this.dataURLtoBlob(dataUrl);

            // Upload blob to Supabase 'member_photos' bucket
            const { data, error } = await supabaseClient.storage
                .from('member_photos')
                .upload(fileName, blob, { contentType: 'image/jpeg', upsert: true });

            if (error) throw error;

            // Get Public Image URL
            const { data: publicUrlData } = supabaseClient.storage
                .from('member_photos')
                .getPublicUrl(fileName);

            const publicUrl = publicUrlData.publicUrl;
            console.log("✅ Profile photo uploaded to Supabase Storage:", publicUrl);
            return publicUrl;
        } catch (e) {
            console.warn("Photo Supabase cloud upload notice (using image data URL):", e.message);
            return dataUrl;
        }
    }

    async saveMember(memberData) {
        if (!memberData.name || !memberData.name.trim()) {
            throw new Error('Customer Name is mandatory.');
        }
        if (!memberData.membershipId || !memberData.membershipId.trim()) {
            throw new Error('Membership ID is mandatory.');
        }

        const cleanId = memberData.membershipId.trim().toUpperCase();
        let photoUrl = memberData.photo || '';

        if (photoUrl && photoUrl.startsWith('data:image/')) {
            photoUrl = await this.uploadPhotoToCloud(photoUrl, cleanId);
        }

        const members = [...this.getAllMembers()];
        const existingIndex = members.findIndex(m => m.membershipId.toUpperCase() === cleanId || m.id === memberData.id);

        const updatedMember = {
            id: memberData.id || cleanId,
            membershipId: cleanId,
            name: memberData.name.trim(),
            phone: memberData.phone ? memberData.phone.trim() : '',
            photo: photoUrl,
            joinDate: memberData.joinDate || (existingIndex >= 0 ? members[existingIndex].joinDate : new Date().toISOString().split('T')[0]),
            tier: memberData.tier || (existingIndex >= 0 ? members[existingIndex].tier : 'Standard'),
            points: typeof memberData.points === 'number' ? memberData.points : (existingIndex >= 0 ? members[existingIndex].points : 0),
            notes: memberData.notes ? memberData.notes.trim() : (existingIndex >= 0 ? members[existingIndex].notes : '')
        };

        // Update local memory cache immediately
        if (existingIndex >= 0) {
            members[existingIndex] = updatedMember;
        } else {
            const idDuplicate = members.find(m => m.membershipId.toUpperCase() === cleanId);
            if (idDuplicate && !isSupabaseEnabled) {
                throw new Error(`Membership ID "${cleanId}" already exists. Please use a unique ID.`);
            }
            members.unshift(updatedMember);
        }

        this.cache = members;
        this.setLocalCache(members);

        // Supabase Database Save
        if (isSupabaseEnabled && supabaseClient) {
            try {
                const { error } = await supabaseClient
                    .from('members')
                    .upsert(updatedMember, { onConflict: 'membershipId' });
                if (error) console.warn("Supabase upsert notice:", error.message);
            } catch (e) {
                console.warn("Supabase save notice:", e);
            }
        }

        if (typeof this.onChangeListener === 'function') {
            this.onChangeListener(this.cache);
        }

        return updatedMember;
    }

    async deleteMember(membershipId) {
        const cleanId = membershipId.trim().toUpperCase();
        
        if (isSupabaseEnabled && supabaseClient) {
            try {
                await supabaseClient
                    .from('members')
                    .delete()
                    .eq('membershipId', cleanId);
            } catch (e) {
                console.warn("Supabase delete notice:", e);
            }
        }

        let members = [...this.getAllMembers()];
        const initialCount = members.length;
        members = members.filter(m => m.membershipId.toUpperCase() !== cleanId);
        
        if (members.length < initialCount) {
            this.cache = members;
            this.setLocalCache(members);
            if (typeof this.onChangeListener === 'function') {
                this.onChangeListener(this.cache);
            }
            return true;
        }
        return false;
    }

    generateUniqueId() {
        const members = this.getAllMembers();
        let candidate = '';
        let exists = true;
        let attempts = 0;
        
        while (exists && attempts < 1000) {
            attempts++;
            const randomNum = Math.floor(1000 + Math.random() * 9000);
            candidate = `MEM-${randomNum}`;
            exists = members.some(m => m.membershipId.toUpperCase() === candidate);
        }

        return candidate;
    }

    resetToDefault() {
        this.cache = DEFAULT_MEMBERS;
        this.setLocalCache(DEFAULT_MEMBERS);
        if (typeof this.onChangeListener === 'function') {
            this.onChangeListener(this.cache);
        }
        return DEFAULT_MEMBERS;
    }

    exportJSON() {
        const members = this.getAllMembers();
        const jsonStr = JSON.stringify(members, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `z_collective_newsagency_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    importJSON(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            if (!Array.isArray(data)) {
                throw new Error('Invalid data format. Expected an array of members.');
            }
            data.forEach((item, idx) => {
                if (!item.name || !item.membershipId) {
                    throw new Error(`Member at index ${idx} is missing required fields (name or membershipId).`);
                }
            });

            if (isSupabaseEnabled && supabaseClient) {
                supabaseClient
                    .from('members')
                    .upsert(data, { onConflict: 'membershipId' });
            }

            this.cache = data;
            this.setLocalCache(data);
            if (typeof this.onChangeListener === 'function') {
                this.onChangeListener(this.cache);
            }
            return data;
        } catch (e) {
            throw new Error('Failed to import JSON: ' + e.message);
        }
    }
}

window.memberStorage = new MemberStorageService();
