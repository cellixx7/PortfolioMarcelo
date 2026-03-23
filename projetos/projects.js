document.addEventListener("DOMContentLoaded", async () => {
    const projectsRoot = document.getElementById("projects-root");

    if (!projectsRoot) return;

    try {
        const response = await fetch("./projetos/projects.html");

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const html = await response.text();
        projectsRoot.innerHTML = html;
    } catch (error) {
        console.error("Erro ao carregar projects.html:", error);
        projectsRoot.innerHTML = "<p>Não foi possível carregar a seção de projetos.</p>";
    }
});