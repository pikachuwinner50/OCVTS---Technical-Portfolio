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
    const now = new Date();
    return `${now.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    })}`;
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

function renderFeaturedProjects(container, projectList = projects) {
    container.innerHTML = "";

    projectList.forEach((project) => {
        const card = document.createElement("div");
        card.className = "project-card";
        card.dataset.category = project.category;

        if (project.featured) {
            const badge = document.createElement("span");
            badge.className = "badge";
            badge.textContent = "Featured";
            card.append(badge);
        }

        const image = document.createElement("img");
        image.src = project.image;
        image.alt = `Project preview for ${project.title}`;
        image.className = "project-card__image";
        image.width = 400;
        image.height = 400;

        const caption = document.createElement("figcaption");
        caption.textContent = `Project preview for ${project.title}`;

        const content = document.createElement("div");
        content.className = "project-card__content";

        const title = document.createElement("h3");
        title.textContent = project.title;

        const description = document.createElement("p");
        description.textContent = project.description;

        const details = document.createElement("div");
        details.className = "project-card__details";

        const technologies = document.createElement("p");
        const technologyLabel = document.createElement("strong");
        technologyLabel.textContent = "Technologies: ";
        technologies.append(technologyLabel, document.createTextNode(project.tech.join(", ")));

        const year = document.createElement("p");
        const yearLabel = document.createElement("strong");
        yearLabel.textContent = "Year: ";
        year.append(yearLabel, document.createTextNode(String(project.year)));

        details.append(technologies, year);

        const projectLinks = [
            ["GitHub", project.links.github],
            ["Live demo", project.links.live]
        ].filter(([, url]) => url);

        if (projectLinks.length > 0) {
            const linksParagraph = document.createElement("p");

            projectLinks.forEach(([label, url], index) => {
                if (index > 0) {
                    linksParagraph.append(" ");
                }

                const link = document.createElement("a");
                link.href = url;
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                link.textContent = label;
                linksParagraph.append(link);
            });

            details.append(linksParagraph);
        }

        content.append(title, description, details);
        card.append(image, caption, content);
        container.append(card);

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
    document.getElementById("print-page")?.addEventListener("click", printPortfolio);    
    document.getElementById("print-form")?.addEventListener("click", () => window.print());
    document.getElementById("clear-console")?.addEventListener("click", () => console.clear());

    document.getElementById("toggle-contact")?.addEventListener("click", () => {
        const contactSection = document.getElementById("contact");
        contactSection.style.display = contactSection.style.display === "none" ? "block" : "none";

    document.querySelectorAll(".message-input").forEach((textarea) => {
    const counter = textarea.nextElementSibling?.querySelector(".char-count");

    if (!counter) {
        return;
    }

    textarea.addEventListener("input", function () {
        const count = this.value.length;
        counter.textContent = count;
        counter.style.color = count > 450 ? "red" : "";
    });
});
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll('nav a[href^="#"]');

function updateActiveNavLink() {
    let currentSectionId = "";

    sections.forEach((section) => {
        if (window.scrollY >= section.offsetTop - 100) {
            currentSectionId = section.id;
        }
    });

    navLinks.forEach((link) => link.classList.remove("active"));

    const activeLink = Array.from(navLinks).find(
        (link) => link.hash === `#${currentSectionId}`
    );
    activeLink?.classList.add("active");
}

window.addEventListener("scroll", updateActiveNavLink);
updateActiveNavLink();
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

function showRandomProject() {
    const banner = document.querySelector("#random-project-banner");
    if (!banner || projects.length === 0) {
        return;
    }

    const previousTitle = localStorage.getItem("previousRandomProjectTitle");
    const choices = projects.length > 1
        ? projects.filter((project) => project.title !== previousTitle)
        : projects;

    const index = Math.floor(Math.random() * choices.length);
    const project = choices[index];

    console.log("Today's featured project: " + project.title);
    renderFeaturedProjects(banner, [project]);
    localStorage.setItem("previousRandomProjectTitle", project.title);
}

document.querySelectorAll('nav a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href").slice(1);
        const target = document.getElementById(targetId);

        if (!target) {
            return;
        }

        event.preventDefault();

        const navHeight = document.querySelector("nav")?.offsetHeight ?? 0;
        const targetTop =
            target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
            top: targetTop,
            behavior: "smooth"
        });
    });
});
function printPortfolio() {
    window.print();
}

initializePage();

showRandomProject();

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

const rawInput = " Alex Morgan ";

const trimmedInput = rawInput.trim();
console.log("Trimmed:", trimmedInput);

const lowercaseInput = trimmedInput.toLowerCase();
console.log("Lowercase:", lowercaseInput);

const inputWithoutNumbers = lowercaseInput.replace(/[0-9]/g, "");
console.log("Numbers removed:", inputWithoutNumbers);

function capitalizeWords(value) {
    return value.replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

const capitalizedInput = capitalizeWords(inputWithoutNumbers);
console.log("Capitalized:", capitalizedInput);

const isValidInput = /^[A-Za-z ]+$/.test(trimmedInput);
console.log("Contains only letters and spaces:", isValidInput);

// function showWelcomeMessage() {
//     alert("Thanks for exploring my portfolio!");
// }

// setTimeout(showWelcomeMessage, 5000);

