import * as handlebars from 'handlebars';
import { I18nService } from 'nestjs-i18n';
import { Column } from '../types/table/table.type';
import { CustomCard } from 'src/modules/user/dto/user-analytics.dto';

/**
 * Registra todos los helpers de Handlebars en un solo lugar.
 */
export function registerHandlebarsHelpers(
    hbs: typeof handlebars,
    i18nService: I18nService,
) {
    // Definimos el idioma de fallback que coincide con app.module.ts
    const FALLBACK_LANGUAGE = 'es';

    // El helper que traduce claves
    hbs.registerHelper('__', (key: string, lang?: string) => {
        const language = lang || FALLBACK_LANGUAGE;
        try {
            // Usamos (i18nService as any) para saltar el error de tipo 'never'
            return (i18nService as any).t(key, { lang: language });
        } catch (error) {
            console.error(`Clave I18n no encontrada: common.${key} para idioma ${language}`);
            return key;
        }
    });

    hbs.registerHelper('ifeq', function (a: any, b: any, options: any) {
        if (a === b) {
            // @ts-ignore
            return options.fn(this); // Renderiza el bloque de código
        }
        // @ts-ignore
        return options.inverse(this); // Renderiza el bloque {{else}}
    });

    hbs.registerHelper('input', function (a: any) {
        return "hello world";
    });

    hbs.registerHelper('eq', function (a: any, b: any) {
        return a === b;
    });

    // Ejemplo de cómo se vería el helper (código fuera del controlador)
    hbs.registerHelper('getPaginationUrl', function (query: any, newPage: number, action: "+" | "-") {
        const params = { ...query, page: query.page ? Number(query.page) : 1 };
        params.page = action === '+' ? ++params.page : --params.page;

        const queryString = Object.keys(params)
            .filter(key => params[key] !== undefined && params[key] !== null && params[key] !== '') // Filtrar valores nulos/vacíos
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');

        return `?${queryString}`;
    })

    hbs.registerHelper('isCurrentSort', function (currentSortBy, columnField) {
        // Retorna true si el campo por el que se está ordenando (currentSortBy)
        // es igual al campo de la columna actual (columnField)
        return currentSortBy === columnField;
    })

    hbs.registerHelper('getSortUrl', function (query: any, field: any) {
        const params = { ...query };

        // Si ya se está ordenando por este campo, alternar el orden
        if (params.sortBy === field) {
            params.sortOrder = (params.sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            // Si es un campo nuevo, ordenar por defecto en 'asc'
            params.sortBy = field;
            params.sortOrder = 'asc';
        }

        // Asegurar que al cambiar el ordenamiento se regresa a la primera página
        delete params.page;

        const queryString = Object.keys(params)
            .filter(key => params[key] !== undefined && params[key] !== null)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');

        return `?${queryString}`;
    })

    // Helper para determinar si omitir la etiqueta (usado en _form_control.hbs)
    hbs.registerHelper('isCheckboxOrRadio', function (controlType: string) {
        return controlType === 'checkbox' || controlType === 'radio';
    });

    // Helper para verificar si el ordenamiento es ascendente (usado en _table.hbs)
    hbs.registerHelper('isAscending', function (sortOrder: string) {
        return sortOrder === 'asc';
    });

    // Helper de igualdad simple para usar en condicionales
    // NOTA: Ya tienes 'eq' y 'ifeq', pero aquí añado el uso de 'eq' como bloque.
    hbs.registerHelper('isEqual', function (a: any, b: any, options: any) {
        if (a === b) {
            // @ts-ignore
            return options.fn(this);
        }
        // @ts-ignore
        return options.inverse(this);
    });

    // Helper para determinar si el valor de un select está en un array (útil para selects múltiples)
    hbs.registerHelper('isInArray', function (value: any, array: any) {
        if (!Array.isArray(array)) {
            return false;
        }
        return array.includes(value);
    });

    // También necesitarás helpers para sumar y restar:
    hbs.registerHelper('add', function (a: number, b: number) { return a + b; })
    hbs.registerHelper('subtract', function (a: number, b: number) { return a - b; })


    /**
     * Helper para formatear un valor basado en el tipo de formato (ej: 'capitalize', 'date', 'email').
     * Es el helper central que reemplaza a 'this.formatter'.
     *
     * @param value El valor de la celda de datos (ej: 'john', '2023-01-01').
     * @param formatType El tipo de formato definido en el array columns (ej: 'capitalize', 'date').
     * @param options Opciones de Handlebars.
     */
    hbs.registerHelper('formatValue', function (value: any, formatType: string, options: any) {
        if (value === undefined || value === null) {
            return '';
        }

        // Convertir el valor a cadena para asegurar el manejo en ciertos casos
        const strValue = String(value);

        switch (formatType) {
            case 'capitalize':
                // Capitaliza la primera letra
                return strValue.charAt(0).toUpperCase() + strValue.slice(1).toLowerCase();

            case 'date':
                // Formatea la fecha (asumiendo que es una cadena válida de fecha)
                try {
                    // Usamos toLocaleDateString para un formato legible por el usuario
                    return new Date(value).toLocaleDateString(FALLBACK_LANGUAGE);
                } catch {
                    return strValue;
                }

            case 'text':
            default:
                return value;
        }
    });

    hbs.registerHelper('dump', function (obj: any) {
        return new hbs.SafeString(JSON.stringify(obj, null, 2));
    });

    function translate(key: string, lang?: string) {
        const language = lang || FALLBACK_LANGUAGE;
        try {
            // Usamos (i18nService as any) para acceder al método t()
            return (i18nService as any).t(key, { lang: language });
        } catch (error) {
            return key; // Retorna la clave si falla
        }
    }

    function buildActionsSelect(actions: any, entityId: string, translateFn: (key: string) => string): string {
        let optionsHtml = `<div class="flex items-center space-x-3">`;

        // 1. Ver Ficha (Carga contenido en el modal)
        if (actions && actions.unique && actions.unique.action === 'modal') {
            const label = translateFn(actions.unique.label);
            const url = actions.unique.link.replace(':id', entityId);
            optionsHtml += `<button type="button" class="bi bi-eye-fill text-blue-600" title="${label}"
                            onclick="loadContentModal('${url}?id=${entityId}', '${label}')">
                         </button>`;
        } else if (actions && actions.unique && (actions.unique.action === 'redirect' || actions.unique.link)) {
            const label = translateFn(actions.unique.label);
            const url = actions.unique.link.replace(':id', entityId);
            optionsHtml += `<a href="${url}?id=${entityId}" class="text-blue-600 bi bi-eye-fill" title="${label}"></a>`;
        }

        // 2. Actualizar (Carga formulario en el modal)
        if (actions && actions.update && actions.update.action === 'modal') {
            const label = translateFn(actions.update.label);
            const url = actions.update.link.replace(':id', entityId);
            optionsHtml += `<button type="button" class="bi bi-pencil-fill text-green-600" title="${label}"
                            onclick="loadContentModal('${url}?id=${entityId}', '${label}')">
                        </button>`;
        } else if (actions && actions.update && actions.update.action === 'redirect') {
            const label = translateFn(actions.update.label);
            const url = actions.update.link.replace(':id', entityId);
            optionsHtml += `<a href="${url}?id=${entityId}" class="text-blue-600 bi bi-pencil-fill" title="${label}"></a>`;
        }

        // 3. Eliminar (Usa el modal de confirmación)
        if (actions && actions.delete && actions.delete.action === 'modal') {
            const label = translateFn(actions.delete.label);
            const url = actions.delete.link.replace(':id', entityId); // Ej: /users/123/delete
            optionsHtml += `<button type="button" class="bi bi-trash-fill text-red-600" title="${label}"
                            onclick="prepareDeleteModal('${url}?id=${entityId}', '${label}')">
                         </button>`;
        } else if (actions && actions.delete && actions.delete.action === 'redirect') {
            const label = translateFn(actions.delete.label);
            const url = actions.delete.link.replace(':id', entityId);
            optionsHtml += `<a href="${url}?id=${entityId}" class="text-blue-600 bi bi-trash-fill" title="${label}"></a>`;
        }

        // 4. Estatus (Carga formulario en el modal)
        if (actions && actions.status && actions.status.action === 'modal') {
            const label = translateFn(actions.status.label);
            const url = actions.status.link.replace(':id', entityId);
            optionsHtml += `<button type="button" class="bi bi-pencil-fill text-green-600" title="${label}"
                            onclick="loadContentModal('${url}?id=${entityId}', '${label}')">
                        </button>`;
        } else if (actions && actions.status && actions.status.action === 'redirect') {
            const label = translateFn(actions.status.label);
            const url = actions.status.link.replace(':id', entityId);
            optionsHtml += `<a href="${url}?id=${entityId}" class="text-blue-600 bi bi-card-fill" title="${label}"></a>`;
        }

        optionsHtml += `</div>`;
        return optionsHtml;
    }

    function formatValue(value: any, formatType: string) {
        if (value === undefined || value === null) return '';
        const strValue = String(value);

        switch (formatType) {
            case 'capitalize':
                return strValue.charAt(0).toUpperCase() + strValue.slice(1).toLowerCase();
            case 'email':
                return `<span class="text-indigo-600 hover:text-indigo-800">${strValue}</a>`;
            case 'date':
                try { return new Date(value).toLocaleDateString('es'); } catch { return strValue; }
            default:
                return value;
        }
    }

    hbs.registerHelper('renderTableRows', function (columns: any[], list: any[], actions: any, lang: string) {
        const translateFn = (key: string) => translate(key, lang);

        if (!list || list.length === 0) {
            return new handlebars.SafeString(
                `<tr><td>No hay resultados</td></tr>`
            );
        }

        let template = '';
        list.forEach(item => {
            template += '<tr>';
            columns.forEach(col => {

                let rawValue = col.field.split('.').reduce((o, i) => o[i], item);

                if (rawValue) {
                    const formattedValue = formatValue(rawValue, col.formatter);
                    template += `<td>${formattedValue}</td>`;
                } else {
                    template += `<td>&nbsp;</td>`;
                }
            });

            // Columna de acciones (debes decidir si la pones aquí o la manejas en Handlebars)
            const entityId = item.id; // Asumimos que 'item' tiene la propiedad 'id'
            const actionsSelectHtml = buildActionsSelect(actions, entityId, translateFn);

            template += `<td class="text-end">${actionsSelectHtml}</td>`;
            template += '</tr>';
        });

        return new handlebars.SafeString(template);
    });

    hbs.registerHelper('formatDate', function (dateParam: Date | string | number | undefined) {
        // 1. Validar y convertir el parámetro a objeto Date
        if (!dateParam) {
            console.error("formatDate: El parámetro de fecha es nulo o indefinido.");
            return 'Fecha no disponible';
        }

        const date = new Date(dateParam);

        // 2. Verificar si la fecha es válida
        if (isNaN(date.getTime())) {
            console.error(`formatDate: La fecha proporcionada '${dateParam}' no es válida.`);
            return 'Fecha inválida';
        }

        // 3. Extraer las partes de la fecha
        const day = date.getDate();
        const year = date.getFullYear();

        // 4. Obtener la abreviatura del mes en inglés y capitalizarla (ej: 'Nov')
        // Usamos 'en-US' para asegurar la abreviatura corta estándar (Jan, Feb, Mar, etc.)
        const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'short' });
        let month = monthFormatter.format(date);

        // Capitalizar la primera letra del mes (ej: 'nov' -> 'Nov')
        month = month.charAt(0).toUpperCase() + month.slice(1).replace('.', ''); // .replace('.', '') para eliminar el punto si aparece (ej: Mar.)

        // 5. Construir y retornar la cadena en el formato deseado
        return `${day} ${month}, ${year}`;
    });

    // ---- JSON ----- //
    hbs.registerHelper('json', function (context) {
        const jsonString = JSON.stringify(context);
        return new hbs.SafeString(jsonString);
    });

    // ---- UI Permits ----- //
    hbs.registerHelper('singlecard', function (card: CustomCard) {
        const color = card.color || 'blue';

        return `
            <div
                class="dashboard-card bg-white p-6 rounded-xl shadow-sm border-l-4 border-${color}-500 transition duration-300">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="text-gray-500 text-sm font-bold">${card.title}</p>
                        <h3 class="text-2xl font-bold mt-1">${card.value}</h3>
                    </div>
                    <div class="bg-${color}-100 p-3 rounded-full">
                        <i class="bi bi-${card.icon} text-${color}-600 text-xl"></i>
                    </div>
                </div>
            </div>
        `;
        /*
        {{!-- <div class="mt-4 flex items-center text-sm text-green-600">
                    <i class="fas fa-arrow-up mr-1"></i>
                    <span>12% from last month</span>
                </div> --}}
        */
    });

    hbs.registerHelper('logger', function (object: any) {
        // console.debug(object)
    })

    hbs.registerHelper('json', function (context) {

        return JSON.stringify(context, null, 2);
    });

    // ---- CURRENCY ---- //
    hbs.registerHelper('formatCurrency', function (value: any, currencyCode: string = 'USD') {
        if (value === undefined || value === null) {
            return `$0.00`;
        }

        // Convertir Decimal/string/number a número flotante
        const numValue = parseFloat(value);

        try {
            // Usamos Intl.NumberFormat para un formato de moneda correcto
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currencyCode,
            }).format(numValue);
        } catch {
            return numValue.toFixed(2);
        }
    });
}
