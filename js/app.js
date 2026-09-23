/**
 * Z COLLECTIVE PVT LTD - NEWSAGENCY CUSTOMER PORTAL & MEMBERSHIP SUITE
 * Manages view routing, member lookup popups, setup & edit workflow, member directory,
 * and security password authentication.
 */

const ADMIN_PASSWORD = 'victor@123';

document.addEventListener('DOMContentLoaded', () => {
    // App State
    let currentEditingMemberId = null;
    let cameraStream = null;
    let pendingAuthCallback = null;

    // DOM Elements - Navigation
    const navTabs = document.querySelectorAll('.tab-btn');
    const viewSections = document.querySelectorAll('.view-section');
    const memberCountBadge = document.getElementById('memberCountBadge');

    // DOM Elements - Header & Global Actions
    const exportJsonBtn = document.getElementById('exportJsonBtn');
    const triggerImportBtn = document.getElementById('triggerImportBtn');
    const importJsonInput = document.getElementById('importJsonInput');

    // DOM Elements - Page 1: Staff Scan & Lookup
    const scanLookupForm = document.getElementById('scanLookupForm');
    const membershipIdInput = document.getElementById('membershipIdInput');
    const quickScanPillsContainer = document.getElementById('quickScanPillsContainer');
    const toggleCameraBtn = document.getElementById('toggleCameraBtn');
    const cameraScannerContainer = document.getElementById('cameraScannerContainer');
    const cameraVideo = document.getElementById('cameraVideo');

    // DOM Elements - Member Verification Modal (Pop-up)
    const verificationModal = document.getElementById('verificationModal');
    const closeVerificationModal = document.getElementById('closeVerificationModal');
    const popupAvatarImg = document.getElementById('popupAvatarImg');
    const popupAvatarPlaceholder = document.getElementById('popupAvatarPlaceholder');
    const popupName = document.getElementById('popupName');
    const popupIdBadge = document.getElementById('popupIdBadge');
    const popupPhone = document.getElementById('popupPhone');
    const popupJoinDate = document.getElementById('popupJoinDate');
    const popupTier = document.getElementById('popupTier');
    const popupPoints = document.getElementById('popupPoints');
    const popupNotes = document.getElementById('popupNotes');
    const popupQrCanvas = document.getElementById('popupQrCanvas');
    const popupEditBtn = document.getElementById('popupEditBtn');

    // DOM Elements - Security Password Modal
    const passwordAuthModal = document.getElementById('passwordAuthModal');
    const closePasswordAuthModal = document.getElementById('closePasswordAuthModal');
    const passwordAuthForm = document.getElementById('passwordAuthForm');
    const authPasswordInput = document.getElementById('authPasswordInput');
    const authPasswordError = document.getElementById('authPasswordError');
    const authActionTitle = document.getElementById('authActionTitle');
    const authActionDesc = document.getElementById('authActionDesc');
    const togglePasswordVisibilityBtn = document.getElementById('togglePasswordVisibilityBtn');

    // DOM Elements - Page 2: Member Setup & Edit
    const memberSetupForm = document.getElementById('memberSetupForm');
    const formHeading = document.getElementById('formHeading');
    const formSubheading = document.getElementById('formSubheading');
    const setupNameInput = document.getElementById('setupNameInput');
    const setupIdInput = document.getElementById('setupIdInput');
    const autoGenIdBtn = document.getElementById('autoGenIdBtn');
    const setupPhoneInput = document.getElementById('setupPhoneInput');
    const setupNotesInput = document.getElementById('setupNotesInput');
    const photoFileInput = document.getElementById('photoFileInput');
    const photoDropArea = document.getElementById('photoDropArea');
    const photoPreviewImg = document.getElementById('photoPreviewImg');
    const photoPreviewPlaceholder = document.getElementById('photoPreviewPlaceholder');
    const removePhotoBtn = document.getElementById('removePhotoBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const submitFormBtn = document.getElementById('submitFormBtn');

    // DOM Elements - Page 3: Member Directory
    const directorySearchInput = document.getElementById('directorySearchInput');
    const membersGrid = document.getElementById('membersGrid');
    const totalMembersStat = document.getElementById('totalMembersStat');
    const photoMembersStat = document.getElementById('photoMembersStat');

    // Toast Container
    const toastContainer = document.getElementById('toastContainer');

    function isPasswordCorrect(inputStr) {
        if (!inputStr) return false;
        const clean = inputStr.trim().replace(/^['"]|['"]$/g, '');
        return clean.toLowerCase() === ADMIN_PASSWORD.toLowerCase();
    }

    // ==========================================
    // INITIALIZATION & TAB ROUTING
    // ==========================================
    function init() {
        bindEvents();
        
        // Listen for live data updates (Firestore or LocalStorage)
        if (window.memberStorage) {
            window.memberStorage.onChangeListener = () => {
                updateMemberBadgesAndStats();
                renderQuickScanPills();
                renderDirectory(directorySearchInput ? directorySearchInput.value : '');
            };
        }

        updateMemberBadgesAndStats();
        renderQuickScanPills();
        renderDirectory();
    }

    function switchTab(targetTabId) {
        navTabs.forEach(tab => {
            if (tab.dataset.tab === targetTabId) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        viewSections.forEach(sec => {
            if (sec.id === targetTabId) {
                sec.classList.add('active');
            } else {
                sec.classList.remove('active');
            }
        });

        if (targetTabId !== 'page-scan' && cameraStream) {
            stopCameraStream();
        }

        if (targetTabId === 'page-scan') {
            membershipIdInput.focus();
        }
    }

    // Security Authentication Helper
    function requestPasswordAuth(title, description, onSuccessCallback) {
        pendingAuthCallback = onSuccessCallback;
        if (authActionTitle) authActionTitle.textContent = title || 'Security Password Verification';
        if (authActionDesc) authActionDesc.textContent = description || 'Please enter staff password to proceed.';
        if (authPasswordInput) {
            authPasswordInput.value = '';
            authPasswordInput.type = 'password';
        }
        if (authPasswordError) authPasswordError.style.display = 'none';

        if (passwordAuthModal) {
            passwordAuthModal.classList.add('open');
            setTimeout(() => {
                if (authPasswordInput) authPasswordInput.focus();
            }, 150);
        }
    }

    function closeAuthModal() {
        if (passwordAuthModal) passwordAuthModal.classList.remove('open');
        pendingAuthCallback = null;
    }

    function bindEvents() {
        navTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;
                if (targetTab !== 'page-setup') {
                    resetSetupFormToNew();
                }
                switchTab(targetTab);
            });
        });

        if (passwordAuthForm) {
            passwordAuthForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const entered = authPasswordInput ? authPasswordInput.value : '';
                
                if (isPasswordCorrect(entered)) {
                    const callback = pendingAuthCallback;
                    closeAuthModal();
                    if (typeof callback === 'function') {
                        callback();
                    }
                    showToast('Access authorized!', 'success');
                } else {
                    if (authPasswordError) authPasswordError.style.display = 'block';
                    const modalBox = passwordAuthModal.querySelector('.modal-box');
                    if (modalBox) {
                        modalBox.classList.remove('shake-error');
                        void modalBox.offsetWidth;
                        modalBox.classList.add('shake-error');
                    }
                    showToast('Incorrect password! Access denied.', 'error');
                }
            });
        }

        if (closePasswordAuthModal) {
            closePasswordAuthModal.addEventListener('click', closeAuthModal);
        }

        if (togglePasswordVisibilityBtn) {
            togglePasswordVisibilityBtn.addEventListener('click', () => {
                if (authPasswordInput.type === 'password') {
                    authPasswordInput.type = 'text';
                    togglePasswordVisibilityBtn.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
                } else {
                    authPasswordInput.type = 'password';
                    togglePasswordVisibilityBtn.innerHTML = '<i class="fa-solid fa-eye"></i>';
                }
            });
        }

        if (exportJsonBtn) {
            exportJsonBtn.addEventListener('click', () => {
                requestPasswordAuth(
                    'Export JSON Backup Database',
                    'Password required to export customer database backup.',
                    () => {
                        window.memberStorage.exportJSON();
                        showToast('Member database exported to JSON file!', 'success');
                    }
                );
            });
        }

        if (triggerImportBtn) {
            triggerImportBtn.addEventListener('click', () => {
                requestPasswordAuth(
                    'Import JSON Backup Database',
                    'Password required to import customer records.',
                    () => {
                        importJsonInput.click();
                    }
                );
            });
        }

        if (importJsonInput) {
            importJsonInput.addEventListener('click', (e) => { e.target.value = ''; });
            importJsonInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        window.memberStorage.importJSON(event.target.result);
                        updateMemberBadgesAndStats();
                        renderQuickScanPills();
                        renderDirectory();
                        showToast('Database imported successfully!', 'success');
                    } catch (err) {
                        showToast(err.message, 'error');
                    }
                };
                reader.readAsText(file);
            });
        }

        if (scanLookupForm) {
            scanLookupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                performMemberLookup(membershipIdInput.value);
            });
        }

        if (membershipIdInput) {
            membershipIdInput.addEventListener('input', (e) => {
                const val = e.target.value.trim();
                if (val.length >= 8) {
                    performMemberLookup(val);
                }
            });
        }

        if (toggleCameraBtn) {
            toggleCameraBtn.addEventListener('click', toggleCameraScanner);
        }

        if (closeVerificationModal) {
            closeVerificationModal.addEventListener('click', closeModal);
        }
        if (verificationModal) {
            verificationModal.addEventListener('click', (e) => {
                if (e.target === verificationModal) closeModal();
            });
        }

        if (popupEditBtn) {
            popupEditBtn.addEventListener('click', () => {
                const memberId = popupEditBtn.dataset.memberId;
                if (memberId) {
                    const member = window.memberStorage.getMemberById(memberId);
                    if (member) {
                        requestPasswordAuth(
                            'Edit Member Details',
                            `Password required to edit profile for ${member.name} (${member.membershipId}).`,
                            () => {
                                closeModal();
                                openMemberInSetupForm(member);
                            }
                        );
                    }
                }
            });
        }

        if (autoGenIdBtn) {
            autoGenIdBtn.addEventListener('click', () => {
                setupIdInput.value = window.memberStorage.generateUniqueId();
                showToast(`Generated Membership ID: ${setupIdInput.value}`, 'success');
            });
        }

        if (photoDropArea) {
            photoDropArea.addEventListener('click', (e) => {
                if (e.target.closest('#removePhotoBtn')) return;
                photoFileInput.click();
            });

            photoDropArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                photoDropArea.style.borderColor = 'var(--brand-primary)';
            });

            photoDropArea.addEventListener('dragleave', () => {
                photoDropArea.style.borderColor = 'var(--glass-border)';
            });

            photoDropArea.addEventListener('drop', (e) => {
                e.preventDefault();
                photoDropArea.style.borderColor = 'var(--glass-border)';
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handlePhotoFile(e.dataTransfer.files[0]);
                }
            });
        }

        if (photoFileInput) {
            photoFileInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files[0]) {
                    handlePhotoFile(e.target.files[0]);
                }
            });
        }

        if (removePhotoBtn) {
            removePhotoBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                setFormPhotoPreview('');
            });
        }

        document.addEventListener('click', (e) => {
            const avatarBtn = e.target.closest('.sample-avatar-opt');
            if (avatarBtn) {
                e.preventDefault();
                const avatarSrc = avatarBtn.dataset.src;
                setFormPhotoPreview(avatarSrc);
                showToast('Sample avatar icon selected!', 'success');
            }
        });

        if (memberSetupForm) {
            memberSetupForm.addEventListener('submit', handleSetupFormSubmit);
        }

        if (cancelEditBtn) {
            cancelEditBtn.addEventListener('click', () => {
                resetSetupFormToNew();
                switchTab('page-directory');
            });
        }

        if (directorySearchInput) {
            directorySearchInput.addEventListener('input', (e) => {
                renderDirectory(e.target.value);
            });
        }
    }

    function performMemberLookup(query) {
        if (!query || !query.trim()) {
            showToast('Please enter a Membership ID, Name, or Phone Number.', 'error');
            return;
        }

        const member = window.memberStorage.getMemberById(query) || 
                       window.memberStorage.searchMembers(query)[0];

        if (member) {
            openVerificationModal(member);
            membershipIdInput.value = '';
        } else {
            showToast(`No member found matching "${query}". Please check the ID or register them.`, 'error');
            const cleanQuery = query.trim().toUpperCase();
            if (confirm(`No member found for ID "${cleanQuery}". Would you like to register a new member with this ID now?`)) {
                resetSetupFormToNew();
                setupIdInput.value = cleanQuery;
                switchTab('page-setup');
            }
        }
    }

    function openVerificationModal(member) {
        if (member.photo) {
            popupAvatarImg.src = member.photo;
            popupAvatarImg.style.display = 'block';
            popupAvatarPlaceholder.style.display = 'none';
        } else {
            popupAvatarImg.style.display = 'none';
            popupAvatarPlaceholder.style.display = 'flex';
        }

        popupName.textContent = member.name;
        popupIdBadge.innerHTML = `<i class="fa-solid fa-id-card"></i> ${member.membershipId}`;
        
        if (member.phone && member.phone.trim()) {
            popupPhone.innerHTML = `<i class="fa-solid fa-phone"></i> ${member.phone}`;
            popupPhone.classList.remove('empty-notice');
        } else {
            popupPhone.textContent = 'Not provided (tap Edit to update)';
            popupPhone.classList.add('empty-notice');
        }

        popupJoinDate.textContent = member.joinDate || 'N/A';
        popupTier.textContent = member.tier || 'Standard';
        popupPoints.textContent = member.points ? `${member.points} pts` : '0 pts';

        if (member.notes && member.notes.trim()) {
            popupNotes.textContent = member.notes;
            popupNotes.classList.remove('empty-notice');
            popupNotes.style.fontStyle = 'normal';
        } else {
            popupNotes.textContent = 'No optional notes recorded for this customer.';
            popupNotes.classList.add('empty-notice');
            popupNotes.style.fontStyle = 'italic';
        }

        popupEditBtn.dataset.memberId = member.membershipId;

        drawQrCode(member.membershipId, popupQrCanvas);

        verificationModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (verificationModal) {
            verificationModal.classList.remove('open');
            document.body.style.overflow = '';
        }
    }

    function renderQuickScanPills() {
        if (!quickScanPillsContainer) return;
        const members = window.memberStorage.getAllMembers().slice(0, 5);
        quickScanPillsContainer.innerHTML = '<span class="pill-label">Demo Quick Scan:</span>';
        
        members.forEach(m => {
            const btn = document.createElement('button');
            btn.className = 'scan-pill-btn';
            btn.innerHTML = `<i class="fa-solid fa-barcode"></i> ${m.membershipId}`;
            btn.addEventListener('click', () => {
                performMemberLookup(m.membershipId);
            });
            quickScanPillsContainer.appendChild(btn);
        });
    }

    function drawQrCode(text, canvas) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const size = 120;
        canvas.width = size;
        canvas.height = size;
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);
        
        ctx.fillStyle = '#0f172a';
        const cellCount = 15;
        const cellSize = size / cellCount;
        
        ctx.fillRect(cellSize, cellSize, cellSize * 3, cellSize * 3);
        ctx.clearRect(cellSize * 1.5, cellSize * 1.5, cellSize * 2, cellSize * 2);
        ctx.fillRect(cellSize * 2, cellSize * 2, cellSize, cellSize);

        ctx.fillRect(cellSize * (cellCount - 4), cellSize, cellSize * 3, cellSize * 3);
        ctx.clearRect(cellSize * (cellCount - 3.5), cellSize * 1.5, cellSize * 2, cellSize * 2);
        ctx.fillRect(cellSize * (cellCount - 3), cellSize * 2, cellSize, cellSize);

        ctx.fillRect(cellSize, cellSize * (cellCount - 4), cellSize * 3, cellSize * 3);
        ctx.clearRect(cellSize * 1.5, cellSize * (cellCount - 3.5), cellSize * 2, cellSize * 2);
        ctx.fillRect(cellSize * 2, cellSize * (cellCount - 3), cellSize, cellSize);

        let hash = 0;
        for (let i = 0; i < text.length; i++) {
            hash = (hash << 5) - hash + text.charCodeAt(i);
            hash |= 0;
        }

        for (let r = 4; r < cellCount - 4; r++) {
            for (let c = 4; c < cellCount - 4; c++) {
                if (((hash + r * 7 + c * 13) % 3) === 0) {
                    ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
                }
            }
        }
    }

    function toggleCameraScanner() {
        if (cameraStream) {
            stopCameraStream();
            toggleCameraBtn.innerHTML = '<i class="fa-solid fa-camera"></i> Start Camera Scanner';
        } else {
            startCameraStream();
        }
    }

    function startCameraStream() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            showToast('Webcam API is not supported on this browser/device.', 'error');
            return;
        }

        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then(stream => {
                cameraStream = stream;
                cameraVideo.srcObject = stream;
                cameraScannerContainer.style.display = 'block';
                toggleCameraBtn.innerHTML = '<i class="fa-solid fa-camera-rotate"></i> Stop Camera Scanner';
                showToast('Camera active! Bring customer barcode to camera.', 'success');
            })
            .catch(err => {
                showToast('Camera access denied or unavailable: ' + err.message, 'error');
            });
    }

    function stopCameraStream() {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            cameraStream = null;
        }
        if (cameraVideo) cameraVideo.srcObject = null;
        if (cameraScannerContainer) cameraScannerContainer.style.display = 'none';
        if (toggleCameraBtn) toggleCameraBtn.innerHTML = '<i class="fa-solid fa-camera"></i> Start Camera Scanner';
    }

    // ==========================================
    // PAGE 2: MEMBER SETUP & EDIT FORM LOGIC
    // ==========================================
    function handlePhotoFile(file) {
        if (!file.type.startsWith('image/')) {
            showToast('Please select a valid image file (PNG, JPG, WEBP, SVG).', 'error');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            showToast('Image file size exceeds 5MB.', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            setFormPhotoPreview(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    function setFormPhotoPreview(src) {
        if (src) {
            photoPreviewImg.src = src;
            photoPreviewImg.style.display = 'block';
            photoPreviewPlaceholder.style.display = 'none';
            removePhotoBtn.style.display = 'inline-flex';
            photoDropArea.dataset.currentSrc = src;
        } else {
            photoPreviewImg.src = '';
            photoPreviewImg.style.display = 'none';
            photoPreviewPlaceholder.style.display = 'flex';
            removePhotoBtn.style.display = 'none';
            photoDropArea.dataset.currentSrc = '';
            photoFileInput.value = '';
        }
    }

    async function handleSetupFormSubmit(e) {
        e.preventDefault();

        const nameVal = setupNameInput.value.trim();
        const idVal = setupIdInput.value.trim();
        const phoneVal = setupPhoneInput ? setupPhoneInput.value.trim() : '';
        const notesVal = setupNotesInput ? setupNotesInput.value.trim() : '';
        const photoVal = photoDropArea.dataset.currentSrc || '';

        if (!nameVal) {
            showToast('Customer Name is mandatory.', 'error');
            setupNameInput.focus();
            return;
        }
        if (!idVal) {
            showToast('Membership ID is mandatory.', 'error');
            setupIdInput.focus();
            return;
        }

        try {
            submitFormBtn.disabled = true;
            submitFormBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

            const memberObj = {
                id: currentEditingMemberId || idVal.toUpperCase(),
                membershipId: idVal,
                name: nameVal,
                phone: phoneVal,
                notes: notesVal,
                photo: photoVal
            };

            const saved = await window.memberStorage.saveMember(memberObj);

            updateMemberBadgesAndStats();
            renderQuickScanPills();
            renderDirectory();

            const isUpdate = Boolean(currentEditingMemberId);
            showToast(
                isUpdate ? `Member "${saved.name}" updated successfully!` : `New member "${saved.name}" registered!`, 
                'success'
            );

            resetSetupFormToNew();
            switchTab('page-directory');
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            submitFormBtn.disabled = false;
            submitFormBtn.innerHTML = currentEditingMemberId 
                ? '<i class="fa-solid fa-floppy-disk"></i> Save Member Updates'
                : '<i class="fa-solid fa-user-plus"></i> Register Member';
        }
    }

    function openMemberInSetupForm(member) {
        currentEditingMemberId = member.membershipId;
        formHeading.textContent = 'Edit Member Profile';
        formSubheading.textContent = `Updating details & notes for ${member.name} (${member.membershipId})`;
        submitFormBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save Member Updates';
        cancelEditBtn.style.display = 'inline-flex';

        setupNameInput.value = member.name || '';
        setupIdInput.value = member.membershipId || '';
        setupIdInput.readOnly = true;
        autoGenIdBtn.style.display = 'none';
        setupPhoneInput.value = member.phone || '';
        if (setupNotesInput) setupNotesInput.value = member.notes || '';

        setFormPhotoPreview(member.photo || '');

        switchTab('page-setup');
    }

    function resetSetupFormToNew() {
        currentEditingMemberId = null;
        formHeading.textContent = 'Register New NewsAgency Member';
        formSubheading.textContent = 'Only Name and Membership ID are mandatory. Phone, notes, and photo can be added later.';
        submitFormBtn.innerHTML = '<i class="fa-solid fa-user-plus"></i> Register Member';
        cancelEditBtn.style.display = 'none';

        if (memberSetupForm) memberSetupForm.reset();
        setupIdInput.readOnly = false;
        autoGenIdBtn.style.display = 'inline-flex';
        if (setupNotesInput) setupNotesInput.value = '';
        setFormPhotoPreview('');
    }

    // ==========================================
    // PAGE 3: REGISTERED MEMBERS DIRECTORY LOGIC
    // ==========================================
    function renderDirectory(searchQuery = '') {
        if (!membersGrid) return;

        const members = window.memberStorage.searchMembers(searchQuery);

        if (members.length === 0) {
            membersGrid.innerHTML = `
                <div class="empty-directory" style="grid-column: 1 / -1;">
                    <i class="fa-solid fa-users-slash"></i>
                    <h3>No NewsAgency Members Found</h3>
                    <p>${searchQuery ? `No records match "${searchQuery}".` : 'No registered members in system yet.'}</p>
                    <button class="btn btn-primary btn-sm" style="margin-top: 1rem;" onclick="document.querySelector('[data-tab=page-setup]').click()">
                        <i class="fa-solid fa-plus"></i> Register First Member
                    </button>
                </div>
            `;
            return;
        }

        membersGrid.innerHTML = '';
        members.forEach(m => {
            const card = document.createElement('div');
            card.className = 'member-card';

            const photoHtml = m.photo
                ? `<img src="${m.photo}" alt="${m.name}" class="card-avatar" />`
                : `<div class="card-avatar-placeholder"><i class="fa-solid fa-user"></i></div>`;

            const phoneHtml = m.phone && m.phone.trim()
                ? `<div class="card-phone"><i class="fa-solid fa-phone"></i> ${m.phone}</div>`
                : `<div class="card-phone missing"><i class="fa-solid fa-triangle-exclamation"></i> No phone listed</div>`;

            const notesHtml = m.notes && m.notes.trim()
                ? `<div class="card-notes" style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.35rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><i class="fa-solid fa-note-sticky" style="color: var(--brand-accent);"></i> ${escapeHtml(m.notes)}</div>`
                : '';

            card.innerHTML = `
                <div class="card-top">
                    ${photoHtml}
                    <div class="card-main-info">
                        <div class="card-member-name">${escapeHtml(m.name)}</div>
                        <div class="card-member-id"><i class="fa-solid fa-id-card"></i> ${m.membershipId}</div>
                        ${phoneHtml}
                        ${notesHtml}
                    </div>
                </div>
                <div class="card-meta-bar">
                    <span class="tier-pill">${m.tier || 'Standard'}</span>
                    <div class="card-actions">
                        <button class="btn btn-secondary btn-sm view-card-btn" title="View Customer Details Popup (No Password Required)">
                            <i class="fa-solid fa-eye"></i> View
                        </button>
                        <button class="btn btn-secondary btn-sm edit-card-btn" title="Edit Member Profile (Password Required)">
                            <i class="fa-solid fa-pen-to-square"></i> Edit <i class="fa-solid fa-lock lock-badge"></i>
                        </button>
                        <button class="btn btn-secondary btn-sm delete-card-btn" title="Delete Member (Password Required)" style="color: var(--danger-red);">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;

            card.addEventListener('click', (e) => {
                if (e.target.closest('.delete-card-btn')) {
                    e.stopPropagation();
                    requestPasswordAuth(
                        'Delete Member Profile',
                        `Password required to delete ${m.name} (${m.membershipId}).`,
                        async () => {
                            if (confirm(`Are you sure you want to permanently delete member ${m.name} (${m.membershipId})?`)) {
                                await window.memberStorage.deleteMember(m.membershipId);
                                updateMemberBadgesAndStats();
                                renderQuickScanPills();
                                renderDirectory(directorySearchInput ? directorySearchInput.value : '');
                                showToast(`Member ${m.name} deleted.`, 'success');
                            }
                        }
                    );
                    return;
                }

                if (e.target.closest('.view-card-btn')) {
                    e.stopPropagation();
                    openVerificationModal(m);
                    return;
                }

                requestPasswordAuth(
                    'Edit Member Details',
                    `Password required to edit personal details & photo for ${m.name} (${m.membershipId}).`,
                    () => {
                        openMemberInSetupForm(m);
                    }
                );
            });

            membersGrid.appendChild(card);
        });
    }

    function updateMemberBadgesAndStats() {
        const members = window.memberStorage.getAllMembers();
        const total = members.length;
        const withPhoto = members.filter(m => Boolean(m.photo)).length;

        if (memberCountBadge) memberCountBadge.textContent = `${total} Members`;
        if (totalMembersStat) totalMembersStat.textContent = total;
        if (photoMembersStat) photoMembersStat.textContent = withPhoto;
    }

    function showToast(message, type = 'success') {
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        const icon = type === 'error' ? 'fa-circle-xmark' : 'fa-circle-check';
        toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${escapeHtml(message)}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'toastSlideOut 0.3s forwards';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>"']/g, match => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[match]));
    }

    init();
});
