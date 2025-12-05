/**
 * Prepara y muestra el modal de confirmación.
 * @param {string} url - La URL para el 'action' del formulario.
 * @param {string} title - El título para el modal.
 */
function prepareDeleteModal(url, title) {
    const modal = document.getElementById('delete-confirm-modal');
    if (!modal) return;

    modal.querySelector('#delete-modal-form').action = url;
    modal.querySelector('#delete-modal-title').textContent = title || 'Confirmar';
    modal.showModal();
}

/**
 * Carga contenido dinámico (fetch) en el modal de contenido.
 * @param {string} url - La URL de la cual cargar el HTML del formulario.
 * @param {string} title - El título para el modal.
 */
async function loadContentModal(url, title) {
    const modal = document.getElementById('content-modal');
    if (!modal) return;

    const modalTitle = modal.querySelector('#content-modal-title');
    const modalBody = modal.querySelector('#content-modal-body');
    const lang = document.querySelector('meta[name="app-lang"]')?.content || 'es';

    modalTitle.textContent = title || 'Cargando...';
    modalBody.innerHTML = '<p>Cargando...</p>';
    modal.showModal();

    try {
        const urlWithLang = new URL(url, window.location.origin);

        console.log(urlWithLang.toString());

        urlWithLang.searchParams.set('lang', lang);
        const response = await fetch(urlWithLang.toString()); // Llama a /users/create-form-json
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const formObject = await response.json();

        modalBody.innerHTML = '';

        console.log(formObject);

        const formElement = buildFormFromJSON(formObject); // Nueva función
        modalBody.appendChild(formElement);
    } catch (error) {
        console.error("Error al cargar modal:", error);
        modalBody.innerHTML = `<p class="text-red-500">Error al cargar contenido.</p>`;
    }
}

/**
 * Construye y devuelve un elemento <form> completo a partir de un objeto JSON
 * (pre-traducido por el backend).
 */
function buildFormFromJSON(form) {
    
    // --- 1. El Elemento <form> Principal ---
    const formEl = document.createElement('form');
    formEl.method = form.method;
    formEl.action = form.action;
    formEl.className = 'space-y-6'; // Tu clase de _dynamic_form_content

    // --- 2. Error Global (si existe) ---
    if (form.globalError) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'p-3 bg-red-100 border border-red-400 text-red-700 rounded mb-4';
        errorDiv.textContent = form.globalError; // Ya viene traducido
        formEl.appendChild(errorDiv);
    }

    // --- 3. Bucle Principal de Secciones/Inputs ---
    form.inputs.forEach(item => {
        
        if (item.elements) {
            // --- ES UNA SECCIÓN (FormSection) ---
            const fieldsetEl = document.createElement('fieldset');
            fieldsetEl.className = `p-3 border border-gray-200 rounded-lg space-y-3 ${item.className || ''}`;

            const legendEl = document.createElement('legend');
            legendEl.className = 'text-lg font-semibold text-gray-900 px-2';
            legendEl.textContent = item.title; // Ya traducido
            fieldsetEl.appendChild(legendEl);

            // Bucle sobre los elementos dentro de la sección
            item.elements.forEach(control => {
                const controlEl = createFormControl(control); // Llama a la fábrica
                fieldsetEl.appendChild(controlEl);
            });
            
            formEl.appendChild(fieldsetEl);

        } else {
            // --- ES UN CONTROL INDIVIDUAL (FormInputType) ---
            const controlEl = createFormControl(item); // Llama a la fábrica
            formEl.appendChild(controlEl);
        }
    });

    // --- 4. Botón de Envío ---
    const submitDiv = document.createElement('div');
    submitDiv.className = 'pt-6 border-t border-gray-200 mt-6';
    
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    // Tus clases de _dynamic_form_content
    submitButton.className = 'w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2';
    submitButton.textContent = form.submitLabel; // Ya traducido
    
    submitDiv.appendChild(submitButton);
    formEl.appendChild(submitDiv);

    return formEl;
}


/**
 * -----------------------------------------------------------------
 * FÁBRICA DE CONTROLES
 * Esta función actúa como el router (el ifeq/else) de tus partials.
 * -----------------------------------------------------------------
 */
function createFormControl(control) {
    // Wrapper principal para cada control
    const wrapper = document.createElement('div');
    wrapper.className = `mb-4 ${control.className || ''}`;

    // Router para llamar al constructor correcto
    switch (control.controlType) {
        case 'input':
            createInputControl(wrapper, control);
            break;
        case 'textarea':
            createTextareaControl(wrapper, control);
            break;
        case 'select':
            createSelectControl(wrapper, control);
            break;
        case 'checkbox':
            createCheckboxControl(wrapper, control);
            break;
        case 'radio':
            createRadioControl(wrapper, control);
            break;
        case 'select-requets':
            createSelectRequestsControl(wrapper, control);
            break;
        default:
            console.warn('Tipo de control desconocido:', control.controlType);
            wrapper.textContent = `Error: Tipo de control '${control.controlType}' no implementado.`;
    }

    // Añadir error de validación (si existe)
    if (control.errorKey) {
        const errorP = document.createElement('p');
        errorP.className = 'mt-2 text-sm text-red-600';
        errorP.textContent = control.errorKey; // Asume que ya viene traducido
        wrapper.appendChild(errorP);
    }
    
    return wrapper;
}


/**
 * -----------------------------------------------------------------
 * CONSTRUCTORES DE CONTROLES ESPECÍFICOS
 * (Replicando _form_control.hbs y el 'select-requets')
 * -----------------------------------------------------------------
 */

// --- Helper para crear el <label> (usado por la mayoría) ---
function createLabel(control) {
    const label = document.createElement('label');
    label.htmlFor = control.name;
    label.className = 'block text-sm font-medium text-gray-700';
    label.textContent = control.label; // Ya traducido

    if (control.required) {
        const star = document.createElement('span');
        star.className = 'text-red-500';
        star.textContent = ' *';
        label.appendChild(star);
    }
    return label;
}

// --- Constructor para 'input' ---
function createInputControl(wrapper, control) {
    wrapper.appendChild(createLabel(control));
    
    const input = document.createElement('input');
    input.type = control.type;
    input.name = control.name;
    input.id = control.name;
    input.value = control.value || '';
    input.placeholder = control.placeholder || '';
    input.className = 'input foucs:outline-none w-full rounded-md border-gray-300 shadow-sm sm:text-sm';
    
    // Atributos booleanos y otros
    if (control.required) input.required = true;
    if (control.disabled) input.disabled = true;
    if (control.readonly) input.readOnly = true;
    if (control.min) input.min = control.min;
    if (control.max) input.max = control.max;

    wrapper.appendChild(input);
}

// --- Constructor para 'textarea' ---
function createTextareaControl(wrapper, control) {
    wrapper.appendChild(createLabel(control));
    
    const textarea = document.createElement('textarea');
    textarea.name = control.name;
    textarea.id = control.name;
    textarea.rows = control.rows || 3;
    textarea.placeholder = control.placeholder || '';
    textarea.className = 'mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm';
    textarea.textContent = control.value || '';
    
    if (control.required) textarea.required = true;
    if (control.disabled) textarea.disabled = true;

    wrapper.appendChild(textarea);
}

// --- Constructor para 'select' ---
function createSelectControl(wrapper, control) {
    wrapper.appendChild(createLabel(control));

    const select = document.createElement('select');
    select.name = control.name;
    select.id = control.name;
    select.className = 'select foucs:outline-none w-full rounded-md border-gray-300 shadow-sm sm:text-sm';
    
    if (control.required) select.required = true;
    if (control.multiple) select.multiple = true;
    
    // Opción "placeholder" deshabilitada
    const placeholderOption = document.createElement('option');
    placeholderOption.value = "";
    placeholderOption.disabled = true;
    placeholderOption.selected = !control.value; // Selecciona si no hay valor
    placeholderOption.textContent = `Seleccione ${control.label}`;
    select.appendChild(placeholderOption);

    // Bucle de opciones
    if (control.options) {
        control.options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.label; // Ya traducido
            if (control.value === opt.value) {
                option.selected = true;
            }
            select.appendChild(option);
        });
    }
    
    wrapper.appendChild(select);
}

// --- Constructor para 'checkbox' ---
function createCheckboxControl(wrapper, control) {
    // La estructura es diferente: label > input + span
    const label = document.createElement('label');
    label.className = 'inline-flex items-center cursor-pointer';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.name = control.name;
    input.id = control.name;
    input.value = control.value || 'on'; // Valor por defecto de checkbox
    input.className = 'checkbox checkbox-primary h-5 w-5 text-indigo-600 border-gray-300 focus:ring-indigo-500';

    if (control.checked) input.checked = true;
    if (control.required) input.required = true;
    if (control.disabled) input.disabled = true;

    const span = document.createElement('span');
    span.className = 'ml-2 text-sm font-medium text-gray-700';
    span.textContent = control.label; // Ya traducido

    if (control.required) {
        const star = document.createElement('span');
        star.className = 'text-red-500';
        star.textContent = ' *';
        span.appendChild(star);
    }

    label.appendChild(input);
    label.appendChild(span);
    
    const innerDiv = document.createElement('div'); // div.mt-1
    innerDiv.className = 'mt-1';
    innerDiv.appendChild(label);
    
    wrapper.appendChild(innerDiv);
}

// --- Constructor para 'radio' ---
function createRadioControl(wrapper, control) {
    // Idéntico al checkbox, solo cambia el type
    const label = document.createElement('label');
    label.className = 'inline-flex items-center cursor-pointer';

    const input = document.createElement('input');
    input.type = 'radio'; // La única diferencia
    input.name = control.name;
    input.id = control.name;
    input.value = control.value; // El valor es crucial aquí
    input.className = 'radio radio-primary h-5 w-5 text-indigo-600 border-gray-300 focus:ring-indigo-500';

    if (control.checked) input.checked = true;
    if (control.required) input.required = true;
    if (control.disabled) input.disabled = true;

    const span = document.createElement('span');
    span.className = 'ml-2 text-sm font-medium text-gray-700';
    span.textContent = control.label;

    if (control.required) {
        const star = document.createElement('span');
        star.className = 'text-red-500';
        star.textContent = ' *';
        span.appendChild(star);
    }

    label.appendChild(input);
    label.appendChild(span);
    
    const innerDiv = document.createElement('div'); // div.mt-1
    innerDiv.className = 'mt-1';
    innerDiv.appendChild(label);
    
    wrapper.appendChild(innerDiv);
}

// --- Constructor para 'select-requets' (El más complejo) ---
function createSelectRequestsControl(wrapper, control) {
    // 1. Crear todos los elementos DOM
    wrapper.appendChild(createLabel(control)); // Label

    // El input visible
    const inputRequets = document.createElement('input');
    inputRequets.name = `${control.name}_IDID`;
    inputRequets.className = 'input foucs:outline-none w-full rounded-md border-gray-300 shadow-sm sm:text-sm';
    inputRequets.type = 'text';
    if (control.required) inputRequets.required = true;

    // Los inputs ocultos
    const inputUrl = document.createElement('input');
    inputUrl.type = 'hidden';
    inputUrl.value = control.path || '';

    const inputPayload = document.createElement('input');
    inputPayload.type = 'hidden';
    inputPayload.value = control.payload || '';

    const inputSetValue = document.createElement('input'); // El que guarda el valor real
    inputSetValue.type = 'hidden';
    inputSetValue.name = control.name;
    inputSetValue.value = control.value || '';

    // El contenedor para la lista de sugerencias (de tu <script>)
    const containerDiv = document.createElement('div');
    containerDiv.style.position = 'relative';
    
    const suggestionsList = document.createElement('ul');
    suggestionsList.className = 'autocomplete-suggestions';
    suggestionsList.style.cssText = 'position: absolute; z-index: 1000; display: none; list-style-type: none; padding: 0; margin: 0; background-color: white; border: 1px solid #ccc; width: 100%;';
    
    // 2. Ensamblar la estructura DOM
    containerDiv.appendChild(inputRequets);
    containerDiv.appendChild(suggestionsList);
    wrapper.appendChild(containerDiv);
    wrapper.appendChild(inputUrl);
    wrapper.appendChild(inputPayload);
    wrapper.appendChild(inputSetValue);

    // 3. Adjuntar la lógica de Event Listeners (de tu <script>)
    // Nota: ¡No usamos getElementById, usamos las variables directas!
    let debounceTimer;

    async function fetchSuggestions(query) {
        const url = `${inputUrl.value}?payload=${inputPayload.value}&param=${query}`;
        
        console.log(url);

        try {
            const result = await fetch(url);
            const dataResult = await result.json();
            const data = dataResult.list || [];
            
            suggestionsList.innerHTML = ''; // Limpiar siempre

            if (data.length > 0) {
                suggestionsList.style.display = 'block';
                data.forEach(result => {
                    const li = document.createElement('li');
                    li.textContent = result.label;
                    li.style.cssText = 'padding: 8px; cursor: pointer; border-bottom: 1px solid #eee;';
                    
                    li.addEventListener('mouseenter', () => li.style.backgroundColor = '#f0f0f0');
                    li.addEventListener('mouseleave', () => li.style.backgroundColor = 'white');
                    
                    li.addEventListener('click', () => {
                        inputRequets.value = result.label;
                        inputSetValue.value = result.value;
                        suggestionsList.style.display = 'none';
                    });
                    suggestionsList.appendChild(li);
                });
            } else {
                suggestionsList.style.display = 'none';
            }
        } catch (error) {
            console.error('Error fetching select-requets:', error);
            suggestionsList.style.display = 'none';
        }
    }

    inputRequets.addEventListener('input', (event) => {
        const query = event.target.value;
        clearTimeout(debounceTimer); // Debounce
        
        debounceTimer = setTimeout(() => {
            if (query && query.length > 0) {
                fetchSuggestions(query);
            } else {
                suggestionsList.innerHTML = '';
                suggestionsList.style.display = 'none';
            }
        }, 300);
    });

    // Cierra la lista si se hace clic fuera
    // (Se adjunta al 'document' porque el modal es dinámico)
    function closeHandler(event) {
        if (!containerDiv.contains(event.target)) {
            suggestionsList.style.display = 'none';
        }
    }
    
    // Adjuntamos el listener al modal, no al documento, para que se limpie solo
    const modal = document.getElementById('content-modal');
    modal.addEventListener('click', closeHandler);
    
    // Opcional: Limpiar el listener cuando el modal se cierre (si usas <dialog>)
    // modal.addEventListener('close', () => {
    //    modal.removeEventListener('click', closeHandler);
    // });
}
