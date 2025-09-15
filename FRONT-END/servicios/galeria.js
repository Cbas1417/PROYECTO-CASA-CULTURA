        // URL base de tu API - ¡IMPORTANTE! Cambia esto por la URL de tu backend
        const API_BASE_URL = 'https://tu-backend.com/api';
        
        // Elementos del DOM
        const albumsContainer = document.getElementById('albums-container');
        const loadingElement = document.getElementById('loading');
        const albumsDiv = document.getElementById('albums');
        const albumView = document.getElementById('album-view');
        const albumTitle = document.getElementById('album-title');
        const photosDiv = document.getElementById('photos');
        const volverBtn = document.getElementById('volver');
        const imageModal = document.getElementById('image-modal');
        const modalImage = document.getElementById('modal-image');
        const modalClose = document.querySelector('.modal-close');
        
        let currentAlbum = null;
        
        // Cargar álbumes desde el backend
        async function loadAlbums() {
            try {
                showLoading();
                
                // En una implementación real, aquí harías una petición a tu API
                // const response = await fetch(`${API_BASE_URL}/albums`);
                // const albums = await response.json();
                
                // Simulamos una respuesta del servidor con un retraso
                setTimeout(() => {
                    // Datos de ejemplo (reemplazar con datos reales de tu API)
                    const albums = [
                        {
                            id: 1,
                            title: "Festival de Arte 2023",
                            photos: [
                                "https://via.placeholder.com/600x400/FF9015/FFFFFF?text=Festival+1",
                                "https://via.placeholder.com/600x400/3D4543/FFFFFF?text=Festival+2",
                                "https://via.placeholder.com/600x400/FF4D4D/FFFFFF?text=Festival+3"
                            ],
                            createdAt: "2023-05-15"
                        },
                        {
                            id: 2,
                            title: "Talleres Culturales",
                            photos: [
                                "https://via.placeholder.com/600x400/3D4543/FFFFFF?text=Taller+1",
                                "https://via.placeholder.com/600x400/FF9015/FFFFFF?text=Taller+2"
                            ],
                            createdAt: "2023-06-22"
                        },
                        {
                            id: 3,
                            title: "Exposición Pictórica",
                            photos: [
                                "https://via.placeholder.com/600x400/FF4D4D/FFFFFF?text=Exposición+1",
                                "https://via.placeholder.com/600x400/FF9015/FFFFFF?text=Exposición+2",
                                "https://via.placeholder.com/600x400/3D4543/FFFFFF?text=Exposición+3",
                                "https://via.placeholder.com/600x400/FF4D4D/FFFFFF?text=Exposición+4"
                            ],
                            createdAt: "2023-07-10"
                        }
                    ];
                    
                    hideLoading();
                    renderAlbums(albums);
                }, 1000);
                
            } catch (error) {
                hideLoading();
                showError('No se pudieron cargar los álbumes. Intenta nuevamente.');
            }
        }
        
        // Renderizar álbumes en la interfaz
        function renderAlbums(albums) {
            albumsDiv.innerHTML = '';
            
            if (albums.length === 0) {
                albumsDiv.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-images"></i>
                        <h3>No hay álbumes disponibles</h3>
                        <p>Pronto tendremos nuevos álbumes fotográficos para ti.</p>
                    </div>
                `;
                return;
            }
            
            albums.forEach(album => {
                const albumElement = document.createElement('div');
                albumElement.classList.add('album');
                
                const thumbnail = album.photos.length > 0 
                    ? `<img src="${album.photos[0]}" alt="${album.title}">`
                    : `<i class="fas fa-image"></i>`;
                
                albumElement.innerHTML = `
                    <div class="album-thumbnail">
                        ${thumbnail}
                    </div>
                    <div class="album-info">
                        <h3>${album.title}</h3>
                        <p>${album.photos.length} foto(s)</p>
                        <p>Creado: ${new Date(album.createdAt).toLocaleDateString('es-ES')}</p>
                    </div>
                `;
                
                albumElement.addEventListener('click', () => {
                    openAlbum(album);
                });
                
                albumsDiv.appendChild(albumElement);
            });
        }
        
        // Abrir un álbum
        function openAlbum(album) {
            currentAlbum = album;
            albumsContainer.classList.add('hidden');
            albumView.classList.remove('hidden');
            albumTitle.textContent = album.title;
            renderPhotos(album.photos);
        }
        
        // Renderizar fotos de un álbum
        function renderPhotos(photos) {
            photosDiv.innerHTML = '';
            
            if (photos.length === 0) {
                photosDiv.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-camera"></i>
                        <h3>No hay fotos en este álbum</h3>
                    </div>
                `;
                return;
            }
            
            photos.forEach(photo => {
                const photoElement = document.createElement('div');
                photoElement.classList.add('photo-item');
                
                photoElement.innerHTML = `
                    <img src="${photo}" alt="Foto">
                `;
                
                photoElement.addEventListener('click', () => {
                    openModal(photo);
                });
                
                photosDiv.appendChild(photoElement);
            });
        }
        
        // Abrir modal con imagen ampliada
        function openModal(imageSrc) {
            modalImage.src = imageSrc;
            imageModal.classList.remove('hidden');
        }
        
        // Mostrar estado de carga
        function showLoading() {
            loadingElement.classList.remove('hidden');
        }
        
        // Ocultar estado de carga
        function hideLoading() {
            loadingElement.classList.add('hidden');
        }
        
        // Mostrar error
        function showError(message) {
            albumsDiv.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Error</h3>
                    <p>${message}</p>
                    <button id="retry-btn" style="margin-top: 15px;">Reintentar</button>
                </div>
            `;
            
            document.getElementById('retry-btn').addEventListener('click', loadAlbums);
        }
        
        // Event listeners
        volverBtn.addEventListener('click', () => {
            albumView.classList.add('hidden');
            albumsContainer.classList.remove('hidden');
        });
        
        modalClose.addEventListener('click', () => {
            imageModal.classList.add('hidden');
        });
        
        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal) {
                imageModal.classList.add('hidden');
            }
        });
        
        // Menú responsive
        const menuToggle = document.getElementById('menu-toggle');
        const menu = document.getElementById('menu');
        
        menuToggle.addEventListener('click', () => {
            menu.classList.toggle('active');
        });
        
        // Dropdown de perfil
        const perfilIcono = document.getElementById('perfil-icono');
        const dropdownMenu = document.getElementById('dropdown-menu');
        
        perfilIcono.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('hidden');
        });
        
        document.addEventListener('click', (e) => {
            if (!perfilIcono.contains(e.target)) {
                dropdownMenu.classList.add('hidden');
            }
        });
        
        // Cargar los álbumes cuando la página esté lista
        document.addEventListener('DOMContentLoaded', loadAlbums);