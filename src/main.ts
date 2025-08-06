// Construction Submittal Template - Professional JavaScript Implementation

let attachedFiles: FileData[] = [];
let submittalCounter = 1;

interface FileData {
    id: string;
    name: string;
    size: number;
    type: string;
    lastModified: number;
    file: File;
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    setDefaultDates();
    setupMutuallyExclusiveCheckboxes();

    // Auto-add first row when switching to multiple mode
    setTimeout(() => {
        if (document.getElementById('submittalsTableBody')?.children.length === 0) {
            addSubmittalRow();
        }
    }, 100);
});

// Set up all event listeners
function setupEventListeners(): void {
    // CSI Division change handler
    const csiDivision = document.getElementById('csiDivision') as HTMLSelectElement;
    if (csiDivision) {
        csiDivision.addEventListener('change', updateSubmittalNumber);
    }

    // File input handler
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
        fileInput.addEventListener('change', handleFiles);
    }

    // Print preparation
    window.addEventListener('beforeprint', () => {
        const inputs = document.querySelectorAll('input, select, textarea') as NodeListOf<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
        for (const input of inputs) {
            if (input.type === 'text' || input.type === 'email' || input.type === 'date' || input.tagName === 'SELECT' || input.tagName === 'TEXTAREA') {
                input.setAttribute('value', input.value);
            }
        }
    });
}

// Mode switching functionality - FIXED
function switchMode(mode: 'single' | 'multiple'): void {
    const singleBtn = document.getElementById('singleModeBtn') as HTMLButtonElement;
    const multipleBtn = document.getElementById('multipleModeBtn') as HTMLButtonElement;
    const singleMode = document.getElementById('singleSubmittalMode') as HTMLElement;
    const multipleMode = document.getElementById('multipleSubmittalsMode') as HTMLElement;
    const enhancedApproval = document.getElementById('enhancedApprovalSection') as HTMLElement;

    if (mode === 'single') {
        singleBtn?.classList.add('active');
        multipleBtn?.classList.remove('active');
        if (singleMode) singleMode.style.display = 'block';
        if (multipleMode) {
            multipleMode.style.display = 'none';
            multipleMode.classList.remove('active');
        }
        if (enhancedApproval) enhancedApproval.style.display = 'block';
    } else {
        singleBtn?.classList.remove('active');
        multipleBtn?.classList.add('active');
        if (singleMode) singleMode.style.display = 'none';
        if (multipleMode) {
            multipleMode.style.display = 'block';
            multipleMode.classList.add('active');
        }
        if (enhancedApproval) enhancedApproval.style.display = 'none';

        // Make sure individual approval sections are visible for existing submittals
        setTimeout(() => {
            const existingRows = document.querySelectorAll('#submittalsTableBody tr');
            if (existingRows.length > 0) {
                // Recreate approval sections for existing submittals if they don't exist
                for (const row of existingRows) {
                    const submittalId = row.getAttribute('data-id');
                    if (submittalId) {
                        const container = document.getElementById('individualApprovalsContainer');
                        const existingSection = container?.querySelector(`[data-submittal-id="${submittalId}"]`);
                        if (!existingSection) {
                            createIndividualApprovalSection(submittalId);
                        }
                    }
                }
                updateSubmittalApprovalTitles();
            }
        }, 100);
    }
}

// Multiple submittals functionality
function addSubmittalRow(): void {
    const tbody = document.getElementById('submittalsTableBody') as HTMLTableSectionElement;
    if (!tbody) return;

    const row = document.createElement('tr');
    const submittalId = `submittal_${Date.now()}`;

    row.innerHTML = `
        <td><input type="text" placeholder="UDG-PO-25-XXX-${String(submittalCounter).padStart(3, '0')}" data-field="number"></td>
        <td><input type="text" placeholder="Description" data-field="description"></td>
        <td>
            <select data-field="division">
                <option value="">Select</option>
                <option value="03">03-Concrete</option>
                <option value="05">05-Metals</option>
                <option value="06">06-Wood</option>
                <option value="07">07-Thermal</option>
                <option value="08">08-Openings</option>
                <option value="09">09-Finishes</option>
                <option value="10">10-Specialties</option>
                <option value="11">11-Equipment</option>
                <option value="21">21-Fire</option>
                <option value="22">22-Plumbing</option>
                <option value="23">23-HVAC</option>
                <option value="26">26-Electrical</option>
            </select>
        </td>
        <td>
            <select data-field="type">
                <option value="">Type</option>
                <option value="SD">SD</option>
                <option value="PD">PD</option>
                <option value="SM">SM</option>
                <option value="MM">MM</option>
                <option value="TE">TE</option>
                <option value="CD">CD</option>
            </select>
        </td>
        <td class="priority-cell">
            <select data-field="priority">
                <option value="">Priority</option>
                <option value="CRITICAL">🔴 CRIT</option>
                <option value="HIGH">🟠 HIGH</option>
                <option value="NORMAL">🟡 NORM</option>
                <option value="LOW">🟢 LOW</option>
            </select>
        </td>
        <td><input type="text" placeholder="Spec Section" data-field="spec"></td>
        <td>
            <select data-field="revision">
                <option value="00">00</option>
                <option value="01">01</option>
                <option value="02">02</option>
                <option value="03">03</option>
            </select>
        </td>
        <td class="actions-cell">
            <button class="remove-submittal" onclick="removeSubmittalRow(this)">×</button>
        </td>
    `;

    row.setAttribute('data-id', submittalId);
    tbody.appendChild(row);
    submittalCounter++;

    // Create individual approval section for this submittal
    createIndividualApprovalSection(submittalId);

    // Add event listeners to update approval titles when inputs change
    const numberInput = row.querySelector('[data-field="number"]') as HTMLInputElement;
    const descriptionInput = row.querySelector('[data-field="description"]') as HTMLInputElement;

    if (numberInput) {
        numberInput.addEventListener('input', updateSubmittalApprovalTitles);
    }
    if (descriptionInput) {
        descriptionInput.addEventListener('input', updateSubmittalApprovalTitles);
    }
}

function removeSubmittalRow(button: HTMLButtonElement): void {
    const row = button.closest('tr');
    if (row) {
        const submittalId = row.getAttribute('data-id');
        row.remove();

        // Remove corresponding approval section
        if (submittalId) {
            removeIndividualApprovalSection(submittalId);
        }
    }
}

function createIndividualApprovalSection(submittalId: string): void {
    const container = document.getElementById('individualApprovalsContainer');
    if (!container) return;

    const approvalSection = document.createElement('div');
    approvalSection.className = 'individual-approval-section';
    approvalSection.setAttribute('data-submittal-id', submittalId);

    approvalSection.innerHTML = `
        <h4 class="submittal-approval-title">🔍 APPROVAL WORKFLOW - UDG-PO-25-XXX-${String(submittalCounter - 1).padStart(3, '0')}</h4>

        <div class="review-party">
            <h4>👷 CONTRACTOR SUBMITTAL REVIEW</h4>
            <div class="review-content">
                <div class="comments-section">
                    <label>Internal Quality Control Comments:</label>
                    <textarea placeholder="QC Manager review comments, completeness check, compliance verification..."></textarea>
                </div>
                <div>
                    <label style="font-size: 11px; text-transform: uppercase; color: #1e293b; margin-bottom: 8px; font-weight: 600;">Submittal Status:</label>
                    <div class="status-checkboxes">
                        <label><input type="checkbox"> ✅ Ready for Review</label>
                        <label><input type="checkbox"> ⚠️ Incomplete - Revise</label>
                        <label><input type="checkbox"> 🚫 Withdrawn</label>
                    </div>
                    <div class="signature-field"></div>
                    <input type="date" class="date-field">
                </div>
            </div>
        </div>

        <div class="review-party">
            <h4>🏗️ STRUCTURAL ENGINEER REVIEW</h4>
            <div class="review-content">
                <div class="comments-section">
                    <label>Structural Engineering Comments:</label>
                    <textarea placeholder="Load calculations, connection details, structural adequacy, code compliance..."></textarea>
                </div>
                <div>
                    <label style="font-size: 11px; text-transform: uppercase; color: #1e293b; margin-bottom: 8px; font-weight: 600;">Review Status:</label>
                    <div class="status-checkboxes">
                        <label><input type="checkbox"> ✅ Approved</label>
                        <label><input type="checkbox"> ⚠️ Approved as Noted</label>
                        <label><input type="checkbox"> 🔄 Revise & Resubmit</label>
                        <label><input type="checkbox"> ❌ Rejected</label>
                    </div>
                    <div class="signature-field"></div>
                    <input type="date" class="date-field">
                </div>
            </div>
        </div>

        <div class="review-party">
            <h4>⚡ MEP ENGINEER REVIEW</h4>
            <div class="review-content">
                <div class="comments-section">
                    <label>MEP Engineering Comments:</label>
                    <textarea placeholder="Mechanical, electrical, plumbing coordination, utility connections, energy efficiency..."></textarea>
                </div>
                <div>
                    <label style="font-size: 11px; text-transform: uppercase; color: #1e293b; margin-bottom: 8px; font-weight: 600;">Review Status:</label>
                    <div class="status-checkboxes">
                        <label><input type="checkbox"> ✅ Approved</label>
                        <label><input type="checkbox"> ⚠️ Approved as Noted</label>
                        <label><input type="checkbox"> 🔄 Revise & Resubmit</label>
                        <label><input type="checkbox"> ❌ Rejected</label>
                    </div>
                    <div class="signature-field"></div>
                    <input type="date" class="date-field">
                </div>
            </div>
        </div>

        <div class="review-party">
            <h4>🏛️ ARCHITECT REVIEW</h4>
            <div class="review-content">
                <div class="comments-section">
                    <label>Architectural Review Comments:</label>
                    <textarea placeholder="Design intent, aesthetic compliance, material specifications, coordination with other systems..."></textarea>
                </div>
                <div>
                    <label style="font-size: 11px; text-transform: uppercase; color: #1e293b; margin-bottom: 8px; font-weight: 600;">Review Status:</label>
                    <div class="status-checkboxes">
                        <label><input type="checkbox"> ✅ Approved</label>
                        <label><input type="checkbox"> ⚠️ Approved as Noted</label>
                        <label><input type="checkbox"> 🔄 Revise & Resubmit</label>
                        <label><input type="checkbox"> ❌ Rejected</label>
                    </div>
                    <div class="signature-field"></div>
                    <input type="date" class="date-field">
                </div>
            </div>
        </div>

        <div class="review-party">
            <h4>📋 PROJECT MANAGER FINAL REVIEW</h4>
            <div class="review-content">
                <div class="comments-section">
                    <label>Project Management Comments:</label>
                    <textarea placeholder="Schedule impact, cost implications, overall project coordination, final approval..."></textarea>
                </div>
                <div>
                    <label style="font-size: 11px; text-transform: uppercase; color: #1e293b; margin-bottom: 8px; font-weight: 600;">Final Status:</label>
                    <div class="status-checkboxes">
                        <label><input type="checkbox"> ✅ Final Approval - Proceed</label>
                        <label><input type="checkbox"> ⚠️ Approved with Conditions</label>
                        <label><input type="checkbox"> ⏸️ Hold - Pending Resolution</label>
                        <label><input type="checkbox"> ❌ Final Rejection</label>
                    </div>
                    <div class="signature-field"></div>
                    <input type="date" class="date-field">
                </div>
            </div>
        </div>
    `;

    container.appendChild(approvalSection);

    // Setup mutually exclusive checkboxes for this new section
    setupMutuallyExclusiveCheckboxesForSection(approvalSection);
}

function removeIndividualApprovalSection(submittalId: string): void {
    const container = document.getElementById('individualApprovalsContainer');
    if (!container) return;

    const approvalSection = container.querySelector(`[data-submittal-id="${submittalId}"]`);
    if (approvalSection) {
        approvalSection.remove();
    }
}

function setupMutuallyExclusiveCheckboxesForSection(section: Element): void {
    const checkboxGroups = section.querySelectorAll('.status-checkboxes') as NodeListOf<HTMLElement>;

    for (const group of checkboxGroups) {
        const checkboxes = group.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;

        for (const checkbox of checkboxes) {
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    // Uncheck all other checkboxes in this group
                    for (const otherCheckbox of checkboxes) {
                        if (otherCheckbox !== this) {
                            otherCheckbox.checked = false;
                        }
                    }
                }
            });
        }
    }
}

// Auto-update submittal number for single mode
function updateSubmittalNumber(): void {
    const csiDivision = document.getElementById('csiDivision') as HTMLSelectElement;
    const divisionNumber = document.getElementById('divisionNumber') as HTMLInputElement;

    if (csiDivision?.value && divisionNumber) {
        divisionNumber.value = csiDivision.value;
    }
}

// Set default dates
function setDefaultDates(): void {
    const today = new Date().toISOString().split('T')[0];

    const submittalDate = document.getElementById('submittalDate') as HTMLInputElement;
    const packageDate = document.getElementById('packageDate') as HTMLInputElement;

    if (submittalDate) submittalDate.value = today;
    if (packageDate) packageDate.value = today;
}

// File handling functionality
function handleFiles(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (!input.files) return;

    const files = Array.from(input.files);
    for (const file of files) {
        addFile(file);
    }
}

function handleDragOver(e: DragEvent): void {
    e.preventDefault();
    if (e.currentTarget) {
        (e.currentTarget as HTMLElement).classList.add('dragover');
    }
}

function handleDragLeave(e: DragEvent): void {
    e.preventDefault();
    if (e.currentTarget) {
        (e.currentTarget as HTMLElement).classList.remove('dragover');
    }
}

function handleDrop(e: DragEvent): void {
    e.preventDefault();
    if (e.currentTarget) {
        (e.currentTarget as HTMLElement).classList.remove('dragover');
    }
    if (!e.dataTransfer) return;

    const files = Array.from(e.dataTransfer.files);
    for (const file of files) {
        addFile(file);
    }
}

function addFile(file: File): void {
    if (file.size > 10 * 1024 * 1024) {
        alert(`File "${file.name}" is too large. Maximum size is 10MB.`);
        return;
    }

    const fileObj: FileData = {
        id: Date.now() + Math.random().toString(),
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        file: file
    };

    attachedFiles.push(fileObj);
    renderFileList();
}

function removeFile(fileId: string): void {
    attachedFiles = attachedFiles.filter(f => f.id !== fileId);
    renderFileList();
}

function renderFileList(): void {
    const fileList = document.getElementById('fileList') as HTMLElement;
    if (!fileList) return;

    if (attachedFiles.length === 0) {
        fileList.innerHTML = '';
        return;
    }

    fileList.innerHTML = attachedFiles.map(file => {
        const icon = getFileIcon(file.name);
        const size = formatFileSize(file.size);
        const date = new Date(file.lastModified).toLocaleDateString();

        let preview = '';
        if (file.type.startsWith('image/')) {
            const url = URL.createObjectURL(file.file);
            preview = `<img src="${url}" style="max-width: 60px; max-height: 40px; margin-right: 12px; border-radius: 4px; object-fit: cover;" alt="${file.name}">`;
        }

        return `
            <div class="file-item">
                ${preview}
                <span style="font-size: 24px; margin-right: 12px; min-width: 24px;">${icon}</span>
                <div class="file-info">
                    <div class="file-name">${file.name}</div>
                    <div class="file-details">${size} • Modified: ${date}</div>
                </div>
                <button class="file-remove" onclick="removeFile('${file.id}')">Remove</button>
            </div>
        `;
    }).join('');
}

function getFileIcon(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    const icons: Record<string, string> = {
        'pdf': '📄', 'dwg': '📐', 'dxf': '📐', 'doc': '📝', 'docx': '📝',
        'xls': '📊', 'xlsx': '📊', 'jpg': '🖼️', 'jpeg': '🖼️', 'png': '🖼️',
        'gif': '🖼️', 'zip': '🗜️', 'rar': '🗜️', '7z': '🗜️'
    };
    return icons[ext] || '📋';
}

function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}

// Checkbox logic to ensure only one option is selected per group
function setupMutuallyExclusiveCheckboxes(): void {
    const checkboxGroups = document.querySelectorAll('.status-checkboxes') as NodeListOf<HTMLElement>;

    for (const group of checkboxGroups) {
        const checkboxes = group.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;

        for (const checkbox of checkboxes) {
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    // Uncheck all other checkboxes in this group
                    for (const otherCheckbox of checkboxes) {
                        if (otherCheckbox !== this) {
                            otherCheckbox.checked = false;
                        }
                    }
                }
            });
        }
    }
}

function updateSubmittalApprovalTitles(): void {
    const container = document.getElementById('individualApprovalsContainer');
    if (!container) return;

    const approvalSections = container.querySelectorAll('.individual-approval-section');
    approvalSections.forEach((section, index) => {
        const title = section.querySelector('.submittal-approval-title');
        if (title) {
            // Get the corresponding table row to extract submittal info
            const tableRow = document.querySelectorAll('#submittalsTableBody tr')[index];
            if (tableRow) {
                const submittalNumber = (tableRow.querySelector('[data-field="number"]') as HTMLInputElement)?.value || `Submittal ${index + 1}`;
                const description = (tableRow.querySelector('[data-field="description"]') as HTMLInputElement)?.value || '';

                let titleText = `🔍 APPROVAL WORKFLOW - ${submittalNumber.toUpperCase()}`;
                if (description) {
                    titleText += ` - ${description.toUpperCase()}`;
                }
                title.textContent = titleText;
            }
        }
    });
}

// Make functions available globally for onclick handlers
declare global {
    interface Window {
        switchMode: typeof switchMode;
        addSubmittalRow: typeof addSubmittalRow;
        removeSubmittalRow: typeof removeSubmittalRow;
        removeFile: typeof removeFile;
        handleDrop: typeof handleDrop;
        handleDragOver: typeof handleDragOver;
        handleDragLeave: typeof handleDragLeave;
    }
}

window.switchMode = switchMode;
window.addSubmittalRow = addSubmittalRow;
window.removeSubmittalRow = removeSubmittalRow;
window.removeFile = removeFile;
window.handleDrop = handleDrop;
window.handleDragOver = handleDragOver;
window.handleDragLeave = handleDragLeave;
