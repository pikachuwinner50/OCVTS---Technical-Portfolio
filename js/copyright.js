let isDark = false;

function getCurrentYear() {
    return new Date().getFullYear();
}

function formatDate(date) {
    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

function getCurrentDate() {
    return formatDate(new Date());
}

function getLastUpdatedDate() {
    return formatDate(new Date(document.lastModified));
}

function validateForm() {
    const contactForm = document.getElementById("contactForm");
    const name = contactForm.elements.name.value.trim();
    const email = contactForm.elements.email.value.trim();
    const message = contactForm.elements.message.value.trim();

    if (name === "" || email === "") {
        alert("Please fill in all fields");
        return false;
    }

    if (!email.includes("@") || !email.includes(".")) {
        alert("Please enter a valid email address");
        return false;
    }

    if (message.length < 10) {
        alert("Message must be at least 10 characters long");
        return false;
    }

    alert("Message sent!");
    return false;
}

function filterProjects(category) {
    const categoryMatches = {
        all: () => true,
        web: (card) => card.dataset.category === "web",
        app: (card) => card.dataset.category === "app"
    };
    const matchesCategory = categoryMatches[category] || categoryMatches.all;
    const filterTimeouts = filterProjects.timeouts;

    document.querySelectorAll(".project-card[data-category]").forEach((card) => {
        const pendingTimeout = filterTimeouts.get(card);
        if (pendingTimeout) {
            clearTimeout(pendingTimeout);
            filterTimeouts.delete(card);
        }

        if (matchesCategory(card)) {
            card.hidden = false;
            requestAnimationFrame(() => card.classList.add("is-visible"));
            return;
        }

        card.classList.remove("is-visible");
        const timeout = setTimeout(() => {
            if (!card.classList.contains("is-visible")) {
                card.hidden = true;
            }
            filterTimeouts.delete(card);
        }, 250);
        filterTimeouts.set(card, timeout);
    });
}
filterProjects.timeouts = new WeakMap();

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function renderFeaturedProjects(container) {
    const featuredProjects = projects.filter((project) => project.featured);
    const projectCardsHTML = featuredProjects.map((project) => {
        const technologies = project.tech.map(escapeHTML).join(", ");
        const githubLink = project.links.github
            ? `<a href="${escapeHTML(project.links.github)}" target="_blank" rel="noopener noreferrer">GitHub</a>`
            : "";
        const liveLink = project.links.live
            ? `<a href="${escapeHTML(project.links.live)}" target="_blank" rel="noopener noreferrer">Live demo</a>`
            : "";
        const links = [githubLink, liveLink].filter(Boolean).join(" ");

        return `
            <article class="project-card" data-category="${escapeHTML(project.category)}">
                <span class="badge">Featured</span>
                <img src="${escapeHTML(project.image)}" alt="Project preview for ${escapeHTML(project.title)}"
                    class="project-card__image" width="400" height="400">
                <figcaption>Project preview for ${escapeHTML(project.title)}</figcaption>
                <div class="project-card__content">
                    <h3>${escapeHTML(project.title)}</h3>
                    <p>${escapeHTML(project.description)}</p>
                    <div class="project-card__details">
                        <p><strong>Technologies:</strong> ${technologies}</p>
                        <p><strong>Year:</strong> ${escapeHTML(project.year)}</p>
                        ${links ? `<p>${links}</p>` : ""}
                    </div>
                </div>
            </article>`;
    }).join("");

    container.innerHTML = projectCardsHTML;
    container.querySelectorAll(".project-card").forEach((card) => {
        requestAnimationFrame(() => card.classList.add("is-visible"));
    });
}

function initializePage() {
    isDark = localStorage.getItem("theme") === "dark";
    document.body.classList.toggle("dark-theme", isDark);

    document.getElementById("theme-toggle")?.addEventListener("click", () => {
        isDark = !isDark;
        document.body.classList.toggle("dark-theme", isDark);
        localStorage.setItem("theme", isDark ? "dark" : "light");
    });

    document.getElementById("say-hello")?.addEventListener("click", () => {
        alert("Thanks for visiting!");
    });
    document.getElementById("print-page")?.addEventListener("click", () => window.print());
    document.getElementById("print-form")?.addEventListener("click", () => window.print());
    document.getElementById("clear-console")?.addEventListener("click", () => console.clear());

    document.getElementById("toggle-contact")?.addEventListener("click", () => {
        const contactSection = document.getElementById("contact");
        contactSection.style.display = contactSection.style.display === "none" ? "block" : "none";
    });

    const contactForm = document.getElementById("contactForm");
    contactForm?.addEventListener("submit", (event) => {
        if (validateForm() === false) {
            event.preventDefault();
        }
    });

    const skillsList = document.querySelector("#skillsList");
    if (skillsList) {
        const extraSkills = {
            SkillsExtra: ["JavaScript"],
        };

        Object.entries(extraSkills).forEach(([category, skills]) => {
            const categoryItem = document.createElement("li");
            categoryItem.textContent = category;

            const categorySkills = document.createElement("ul");
            skills.forEach((skill) => {
                const skillItem = document.createElement("li");
                skillItem.textContent = skill;
                categorySkills.append(skillItem);
            });

            categoryItem.append(categorySkills);
            skillsList.append(categoryItem);
        });
    }

    const tableBody = document.querySelector("table tbody");
    const rowCountDisplay = document.querySelector("#table-row-count");
    const statusCountDisplay = document.querySelector("#project-status-counts");
    if (tableBody && rowCountDisplay && statusCountDisplay) {
        function updateProjectCounts() {
            const rows = document.querySelectorAll("table tbody tr");
            console.log(rows.length);
            rowCountDisplay.textContent = `Project rows: ${rows.length}`;

            const statusCounts = {
                completed: 0,
                inProgress: 0,
                notStarted: 0
            };

            for (const row of rows) {
                const statusCell = row.cells[3];
                if (!statusCell) {
                    continue;
                }

                const status = statusCell.textContent.trim().toLowerCase();
                if (status === "complete" || status === "completed") {
                    statusCounts.completed++;
                } else if (status === "in progress") {
                    statusCounts.inProgress++;
                } else if (status === "not started") {
                    statusCounts.notStarted++;
                }
            }

            statusCountDisplay.textContent =
                `Completed: ${statusCounts.completed} | In progress: ${statusCounts.inProgress} | Not started: ${statusCounts.notStarted}`;
        }

        updateProjectCounts();
        new MutationObserver(updateProjectCounts).observe(tableBody, {
            childList: true,
            characterData: true,
            subtree: true
        });
    }

    const projectsContainer = document.querySelector("#projectsContainer");
    if (projectsContainer) {
        console.log(projects);
        console.log(projects[1].title);
        renderFeaturedProjects(projectsContainer);
        document.getElementById("project-filter")?.addEventListener("change", (event) => {
            filterProjects(event.currentTarget.value);
        });
    }

    const currentDate = document.getElementById("current-date");
    const lastUpdated = document.getElementById("last-updated");
    if (currentDate && lastUpdated) {
        console.time("Begin.");
        console.log("Welcome to Jacob Hadley's Portfolio!");
        console.warn("Congratulation! YOU FOUND THE SECRET CONSOLE MESSAGE!");
        console.table([
            { Skills: "Java" },
            { Skills: "Python" },
            { Skills: "Javascript" },
            { Skills: "HTML" },
            { Skills: "CSS" },
            { Skills: "PHP" }
        ]);
        currentDate.textContent = getCurrentDate();
        lastUpdated.textContent = getLastUpdatedDate();
        console.timeEnd("Begin.");
    }
}

const projects = [
    {
        title: "Snake Game",
        tech: ["JavaScript"],
        image: "images/fluffy%20cow.jpg",
        description: "A JavaScript-based Snake game.",
        featured: true,
        year: 2025,
        category: "app",
        links: {
            github: "https://github.com/pikachuwinner50/OCVTS---Technical-Portfolio",
            live: ""
        }
    },
    {
        title: "DND RPG GAME",
        tech: ["Python"],
        image: "images/fluffy%20cow.jpg",
        description: "A Python-based role-playing game.",
        featured: false,
        year: 2025,
        category: "app",
        links: {
            github: "https://github.com/pikachuwinner50/OCVTS---Technical-Portfolio",
            live: ""
        }
    },
    {
        title: "Portfolio Website",
        tech: ["HTML", "CSS", "JavaScript"],
        image: "images/fluffy%20cow.jpg",
        description: "A portfolio website showcasing projects and technical skills.",
        featured: false,
        year: 2026,
        category: "web",
        links: {
            github: "https://github.com/pikachuwinner50/OCVTS---Technical-Portfolio",
            live: ""
        }
    }
].sort((firstProject, secondProject) => firstProject.year - secondProject.year);

initializePage();

const skills = {
    Skills: ["HTML", "CSS", "JavaScript"],
};

console.log("Frontend skill count:", skills.Skills.length);
skills.listAll = function () {
    return Object.entries(this)
        .filter(([, value]) => Array.isArray(value))
        .flatMap(([, value]) => value);
};

console.log("All skills:", skills.listAll());
console.log("Skills JSON:", JSON.stringify(skills));
