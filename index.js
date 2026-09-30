const typingRole = document.querySelector("#typing-role");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const navbarToggle = document.querySelector(".navbar-toggler");
const navbarCollapse = document.querySelector("#navbarNav");

if (navbarToggle && navbarCollapse) {
	navbarToggle.addEventListener("click", () => {
		const isOpen = navbarCollapse.classList.toggle("is-open");
		navbarToggle.setAttribute("aria-expanded", String(isOpen));
	});

	navbarCollapse.querySelectorAll("a").forEach((link) => {
		link.addEventListener("click", () => {
			navbarCollapse.classList.remove("is-open");
			navbarToggle.setAttribute("aria-expanded", "false");
		});
	});
}

const projectCarousel = document.querySelector("#projectCarousel");

if (projectCarousel) {
	const slides = [...projectCarousel.querySelectorAll(".carousel-item")];
	const previousButton = projectCarousel.querySelector(".carousel-control-prev");
	const nextButton = projectCarousel.querySelector(".carousel-control-next");
	let activeSlide = Math.max(0, slides.findIndex((slide) => slide.classList.contains("active")));

	function showSlide(nextIndex) {
		slides[activeSlide].classList.remove("active");
		slides[activeSlide].setAttribute("aria-hidden", "true");
		activeSlide = (nextIndex + slides.length) % slides.length;
		slides[activeSlide].classList.add("active");
		slides[activeSlide].removeAttribute("aria-hidden");
	}

	slides.forEach((slide, index) => {
		if (index !== activeSlide) slide.setAttribute("aria-hidden", "true");
	});

	previousButton?.addEventListener("click", () => showSlide(activeSlide - 1));
	nextButton?.addEventListener("click", () => showSlide(activeSlide + 1));
}

const root = document.documentElement;
const revealGroups = [
	[".projects-section .section-title", ".projects-section .section-copy"],
	[".project-card"],
	[".tools-heading"],
	[".tool-group"],
	[".contact-intro", ".contact-form"]
];

if (!reduceMotion) {
	root.classList.add("motion-ready");
	root.dataset.scrollDirection = "down";

	const revealItems = [];

	revealGroups.forEach((selectors) => {
		const items = document.querySelectorAll(selectors.join(", "));

		items.forEach((item, index) => {
			item.classList.add("scroll-reveal");
			item.classList.add(`reveal-delay-${Math.min(index, 4)}`);
			revealItems.push(item);
		});
	});

	const revealObserver = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add("is-visible");
				revealObserver.unobserve(entry.target);
			}
		});
	}, { rootMargin: "-7% 0px -7% 0px", threshold: 0.08 });

	revealItems.forEach((item) => revealObserver.observe(item));

	let previousScrollY = window.scrollY;
	let scrollTicking = false;

	function updateScrollEffects() {
		const currentScrollY = window.scrollY;
		const movement = currentScrollY - previousScrollY;

		if (Math.abs(movement) > 3) {
			root.dataset.scrollDirection = movement > 0 ? "down" : "up";
		}

		previousScrollY = currentScrollY;
		scrollTicking = false;
	}

	window.addEventListener("scroll", () => {
		if (!scrollTicking) {
			window.requestAnimationFrame(updateScrollEffects);
			scrollTicking = true;
		}
	}, { passive: true });

	updateScrollEffects();
}

if (typingRole && !reduceMotion) {
	const roles = ["Software Engineer", "Web Designer", "Full Stack Web Developer"];
	let roleIndex = 0;
	let characterIndex = roles[0].length;
	let deleting = true;

	function updateRole() {
		const currentRole = roles[roleIndex];
		typingRole.textContent = currentRole.slice(0, characterIndex);

		if (deleting) {
			characterIndex--;

			if (characterIndex < 0) {
				deleting = false;
				roleIndex = (roleIndex + 1) % roles.length;
				characterIndex = 0;
				setTimeout(updateRole, 300);
				return;
			}

			setTimeout(updateRole, 45);
			return;
		}

		characterIndex++;

		if (characterIndex > currentRole.length) {
			deleting = true;
			characterIndex = currentRole.length;
			setTimeout(updateRole, 1400);
			return;
		}

		setTimeout(updateRole, 85);
	}

	setTimeout(updateRole, 1400);
}

const copyButtons = document.querySelectorAll(".copy-button");

copyButtons.forEach((button) => {
	button.addEventListener("click", async () => {
		try {
			await navigator.clipboard.writeText(button.dataset.copy);
			button.classList.add("is-copied");
			button.setAttribute("aria-label", "Copied");

			setTimeout(() => {
				button.classList.remove("is-copied");
				button.setAttribute("aria-label", button.title);
			}, 1600);
		} catch (error) {
			button.classList.add("copy-failed");
			button.setAttribute("aria-label", "Could not copy");
			setTimeout(() => button.classList.remove("copy-failed"), 1600);
		}
	});
});
