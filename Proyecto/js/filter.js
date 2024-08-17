document.addEventListener('DOMContentLoaded', function () {
    // Manejador para mostrar/ocultar el menú de filtros
    const filterButton = document.querySelector('.dropdown-toggle');
    const filterMenu = document.querySelector('.filter-dropdown-menu');

    if (filterButton && filterMenu) {
        filterButton.addEventListener('click', function () {
            filterMenu.classList.toggle('show');
        });
    }

    // Script para mostrar el rango de precio en tiempo real
    const priceRangeInput = document.getElementById('priceRange');
    if (priceRangeInput) {
        priceRangeInput.addEventListener('input', function () {
            document.getElementById('priceRangeOutput').textContent = `$ ${this.value}`;
            document.getElementById('priceRangeOutputMax').textContent = `$ ${this.max}`;
        });
    }

    // Verifica si el formulario de filtro está en la página
    const filterForm = document.getElementById('filterForm');
    if (filterForm) {
        filterForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const selectedCategories = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
                .map(input => input.value);
            const priceRange = document.getElementById('priceRange').value.split('-')
                .map(price => parseFloat(price.trim()));

            // Filtrar productos basado en los filtros seleccionados
            console.log('Categorías seleccionadas:', selectedCategories);
            console.log('Rango de precio seleccionado:', priceRange);
        });
    }

    // Función para actualizar la visibilidad de las subcategorías
    function updateSubcategories() {
        const selectedCategories = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
            .map(input => input.value);

        const allSubcategories = document.querySelectorAll('.subcategory');
        allSubcategories.forEach(subcategory => {
            subcategory.style.display = 'none';
        });

        selectedCategories.forEach(categoryValue => {
            const elements = document.querySelectorAll(`.${categoryValue}-subcategory`);
            elements.forEach(element => {
                element.style.display = 'block';
            });
        });

        if (selectedCategories.length === 0) {
            allSubcategories.forEach(subcategory => {
                subcategory.style.display = 'block';
            });
        }
    }

    // Filtros activos (Ojos, Rostro, Labios, Cejas) y limpieza de filtros
    const filters = {
        Ojos: false,
        Rostro: false,
        Labios: false,
        Cejas: false
    };

    const filterContainer = document.getElementById('active-filters');
    const filterHeader = document.getElementById('filter-header');
    const clearFiltersButton = document.getElementById('clear-filters');

    // Función para agregar un filtro
    function addFilter(name) {
        if (!filters[name]) {
            filters[name] = true;

            const filterTag = document.createElement('div');
            filterTag.className = 'filter-tag';
            filterTag.setAttribute('data-filter', name);
            filterTag.innerHTML = `${name} <span class="remove-filter">&times;</span>`;
            filterContainer.appendChild(filterTag);

            filterTag.querySelector('.remove-filter').addEventListener('click', () => {
                removeFilter(name);
            });
        }
    }

    // Función para eliminar un filtro
function removeFilter(name) {
    console.log(`Removing filter: ${name}`);
    
    // Desmarcar todos los checkboxes asociados al filtro
    document.querySelectorAll(`input[data-filter="${name}"]`).forEach(checkbox => {
        console.log(`Unchecking: ${checkbox.id}`);
        checkbox.checked = false;
    });

    // Eliminar la etiqueta del filtro activo
    const filterTag = document.querySelector(`.filter-tag[data-filter="${name}"]`);
    if (filterTag) {
        filterTag.parentElement.removeChild(filterTag);
    }

    // Actualizar los filtros activos y aplicar los filtros
    updateActiveFilters();
    applyFilters();
}  

    // Función para limpiar todos los filtros
    function clearFilters() {
        filterContainer.innerHTML = '';
        document.querySelectorAll('.filter-options input').forEach(checkbox => {
            checkbox.checked = false;
        });
        for (const key in filters) {
            filters[key] = false;
        }
        updateActiveFilters();
        applyFilters();
    }

    clearFiltersButton.addEventListener('click', clearFilters);

    // Función para actualizar los filtros activos
    function updateActiveFilters() {
        const activeFiltersContainer = document.getElementById("active-filters");
        activeFiltersContainer.innerHTML = ""; // Limpiar contenido anterior

        const filters = []; // Array para almacenar filtros activos

        // Obtener filtros de categoría
        const categoryFilters = document.querySelectorAll("#category-form .form-check-input:checked");
        categoryFilters.forEach((checkbox) => {
            filters.push(checkbox.nextElementSibling.textContent);
        });

        // Obtener filtros de subcategoría
        const subcategoryFilters = document.querySelectorAll("#subcategory-form .form-check-input:checked");
        subcategoryFilters.forEach((checkbox) => {
            filters.push(checkbox.nextElementSibling.textContent);
        });

        // Obtener filtros de precio
        const minPrice = document.getElementById("min-price").value;
        const maxPrice = document.getElementById("max-price").value;
        if (minPrice || maxPrice) {
            filters.push(`Precio entre $${minPrice || '0'} y $${maxPrice || '∞'}`);
        }

        // Actualizar el encabezado y los filtros activos
        if (filters.length > 0) {
            filterHeader.textContent = "Filtrado por:";
            filters.forEach((filter) => {
                const filterElement = document.createElement("div");
                filterElement.className = "filter-tag";
                filterElement.textContent = filter;

                // Agregar una X para eliminar el filtro
                const removeButton = document.createElement("span");
                removeButton.className = "remove-filter";
                removeButton.textContent = "×";
                removeButton.addEventListener("click", () => {
                    const filterName = filter.split(" ")[0]; // Asumiendo que el nombre del filtro es la primera palabra
                    removeFilter(filterName);
                });

                filterElement.appendChild(removeButton);
                activeFiltersContainer.appendChild(filterElement);
            });
        } else {
            filterHeader.textContent = "Sin filtros aplicados";
        }
    }

    // Función para aplicar filtros
    function applyFilters() {
        console.log('Filtros aplicados:', filters);
        // Aquí iría la lógica para mostrar u ocultar elementos según los filtros aplicados
    }

    // Agregar eventos a los filtros
    document.getElementById("category-form").addEventListener("change", updateActiveFilters);
    document.getElementById("subcategory-form").addEventListener("change", updateActiveFilters);
    document.getElementById("price-form").addEventListener("input", updateActiveFilters);

    // Manejo de eventos de cambio en los checkboxes de filtro
    document.querySelectorAll('.filter-options input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const filterName = checkbox.dataset.filter;
            if (checkbox.checked) {
                addFilter(filterName);
            } else {
                removeFilter(filterName);
            }
            updateActiveFilters();
            applyFilters();
        });
    });

    // Inicializar la visibilidad de filtros activos
    updateActiveFilters();
    updateSubcategories();

    // Manejador para eliminar filtros individuales
    const activeFiltersContainer = document.getElementById('active-filters');
    activeFiltersContainer.addEventListener('click', function (e) {
        if (e.target.classList.contains('remove-filter')) {
            const filterTag = e.target.parentElement; // Elemento del filtro completo
            const filterName = filterTag.getAttribute('data-filter'); // Obtener el nombre del filtro desde el atributo data-filter
            filterTag.remove(); // Elimina el filtro de la vista
            removeFilter(filterName); // Llamar a la función para desmarcar el checkbox
        }
    });
});
