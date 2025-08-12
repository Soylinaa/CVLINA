// Esperar a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM cargado - Iniciando scripts personalizados")

  // ===== VARIABLES GLOBALES =====
  const navbar = document.querySelector(".navbar")
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]')
  const sections = document.querySelectorAll("section[id]")
  const cards = document.querySelectorAll(".card")
  const heroTitle = document.querySelector(".hero-content h1")
  const bootstrap = window.bootstrap

  // ===== SMOOTH SCROLL PARA NAVEGACIÓN =====
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      console.log("Click en enlace:", this.getAttribute("href"))

      const targetId = this.getAttribute("href")
      const targetSection = document.querySelector(targetId)

      if (targetSection) {
        const headerHeight = navbar.offsetHeight
        const targetPosition = targetSection.offsetTop - headerHeight - 20

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })

        // Cerrar el menú en móviles después del click
        const navbarCollapse = document.querySelector(".navbar-collapse")
        if (navbarCollapse && navbarCollapse.classList.contains("show")) {
          const bsCollapse = new bootstrap.Collapse(navbarCollapse)
          bsCollapse.hide()
        }
      }
    })
  })

  // ===== HIGHLIGHT DEL ENLACE ACTIVO =====
  function highlightActiveSection() {
    const scrollPosition = window.scrollY + 150

    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.offsetHeight
      const sectionId = section.getAttribute("id")
      const correspondingLink = document.querySelector(`a[href="#${sectionId}"]`)

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach((link) => link.classList.remove("active"))
        if (correspondingLink) {
          correspondingLink.classList.add("active")
        }
      }
    })
  }

  // ===== CAMBIO DE ESTILO DEL NAVBAR AL HACER SCROLL =====
  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }
  }

  // ===== ANIMACIONES DE ENTRADA CON INTERSECTION OBSERVER =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // EXCLUIR LA FOTO DE PERFIL DE LAS ANIMACIONES
        if (
          !entry.target.classList.contains("profile-image-container") &&
          !entry.target.classList.contains("profile-image")
        ) {
          entry.target.style.opacity = "1"
          entry.target.style.transform = "translateY(0)"
          entry.target.classList.add("loaded")
        }
      }
    })
  }, observerOptions)

  // Observar cards EXCLUYENDO la foto de perfil
  cards.forEach((card, index) => {
    // NO aplicar animaciones a la foto de perfil
    if (!card.classList.contains("profile-image-container")) {
      card.style.opacity = "0"
      card.style.transform = "translateY(30px)"
      card.style.transition = `all 0.6s ease ${index * 0.1}s`
      card.classList.add("loading")
      observer.observe(card)
    }
  })

  // ===== EFECTO DE TYPING PARA EL TÍTULO PRINCIPAL =====
  function initTypingEffect() {
    if (heroTitle) {
      const text = heroTitle.textContent
      heroTitle.textContent = ""
      heroTitle.style.borderRight = "2px solid white"
      heroTitle.style.whiteSpace = "nowrap"
      heroTitle.style.overflow = "hidden"

      let i = 0
      const typeWriter = () => {
        if (i < text.length) {
          heroTitle.textContent += text.charAt(i)
          i++
          setTimeout(typeWriter, 100)
        } else {
          setTimeout(() => {
            heroTitle.style.borderRight = "none"
          }, 1000)
        }
      }

      setTimeout(typeWriter, 1500)
    }
  }

  // ===== ANIMACIÓN DE CONTADOR PARA BADGES =====
  function animateCounters() {
    const badges = document.querySelectorAll(".badge")
    badges.forEach((badge) => {
      badge.addEventListener("mouseenter", function () {
        this.style.transform = "scale(1.1)"
      })

      badge.addEventListener("mouseleave", function () {
        this.style.transform = "scale(1)"
      })
    })
  }

  // ===== EFECTO DE HOVER PARA ICONOS (EXCLUYENDO LA FOTO) =====
  function initIconEffects() {
    const icons = document.querySelectorAll(".bi")
    icons.forEach((icon) => {
      // NO aplicar efectos a iconos dentro de la foto de perfil
      if (!icon.closest(".profile-image-container")) {
        icon.addEventListener("mouseenter", function () {
          this.style.transform = "scale(1.2) rotate(5deg)"
        })

        icon.addEventListener("mouseleave", function () {
          this.style.transform = "scale(1) rotate(0deg)"
        })
      }
    })
  }

  // ===== LAZY LOADING PARA IMÁGENES (EXCLUYENDO LA FOTO DE PERFIL) =====
  function initLazyLoading() {
    const images = document.querySelectorAll("img[src]")
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target

          // NO aplicar lazy loading a la foto de perfil
          if (!img.classList.contains("profile-image")) {
            img.style.opacity = "0"
            img.style.transition = "opacity 0.5s ease"

            img.onload = () => {
              img.style.opacity = "1"
            }
          }

          imageObserver.unobserve(img)
        }
      })
    })

    images.forEach((img) => imageObserver.observe(img))
  }

  // ===== EVENT LISTENERS =====
  window.addEventListener("scroll", () => {
    highlightActiveSection()
    handleNavbarScroll()
    // NO parallax para mantener todo estático
  })

  window.addEventListener("resize", () => {
    highlightActiveSection()
  })

  // ===== INICIALIZAR TODAS LAS FUNCIONES =====
  function init() {
    console.log("Inicializando efectos...")

    highlightActiveSection()
    handleNavbarScroll()
    initTypingEffect()
    animateCounters()
    initIconEffects()
    initLazyLoading()

    if (bootstrap) {
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
      const tooltipList = tooltipTriggerList.map((tooltipTriggerEl) => {
        return new bootstrap.Tooltip(tooltipTriggerEl)
      })
    }

    console.log("Todos los efectos inicializados correctamente")
    console.log("Foto de perfil: COMPLETAMENTE ESTÁTICA ✓")
  }

  init()

  // ===== SMOOTH SCROLL PARA ENLACES DEL FOOTER =====
  const footerLinks = document.querySelectorAll('footer a[href^="#"]')
  footerLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href")
      const targetSection = document.querySelector(targetId)

      if (targetSection) {
        const headerHeight = navbar.offsetHeight
        const targetPosition = targetSection.offsetTop - headerHeight - 20

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    })
  })

  // ===== EFECTO DE CARGA COMPLETA =====
  window.addEventListener("load", () => {
    document.body.classList.add("loaded")
    console.log("Página completamente cargada")
  })

  // ===== DEBUG INFO =====
  console.log("Scripts cargados:")
  console.log("- Smooth scroll: ✓")
  console.log("- Active link highlighting: ✓")
  console.log("- Navbar scroll effect: ✓")
  console.log("- Card animations: ✓")
  console.log("- Parallax effect: ✗ (Desactivado)")
  console.log("- Typing effect: ✓")
  console.log("- Icon effects: ✓")
  console.log("- Lazy loading: ✓")
  console.log("- Foto de perfil: ESTÁTICA ✓")
})

console.log("Menu.js cargado completamente ✓")
