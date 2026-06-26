export type Project = {
    id: number;
    project_name: string;
    project_manager_id: number;
    project_description: string;
};

// GET /projects/:id - Get project by ID
export const getProjectById = async (id: number): Promise<Project> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/projects/${id}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch project with ID ${id}`);
    }

    const data = (await response.json()) as Project;
    return data;
};

// GET /projects/all - Get all projects
export const getAllProjects = async (): Promise<Project[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/projects/all`);

    if (!response.ok) {
        throw new Error("Failed to fetch all projects");
    }

    const data = (await response.json()) as Project[];
    return data;
};

// GET /projects/manager/:manager_id - Get projects by manager ID
export const getProjectsByManagerId = async (managerId: number): Promise<Project[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/projects/manager/${managerId}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch projects for manager ID ${managerId}`);
    }

    const data = (await response.json()) as Project[];
    return data;
};

// POST /projects - Create a new project
export const createProject = async (project: Omit<Project, "id">): Promise<Project> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/projects`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: project.project_name,
            managerId: project.project_manager_id,
            description: project.project_description,
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to create project");
    }

    const data = (await response.json()) as Project;
    return data;
};

// PUT /projects/:id - Update a project by ID
export const updateProjectById = async (
    id: number,
    project: Partial<Omit<Project, "id">>
): Promise<Project> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/projects/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
    });

    if (!response.ok) {
        throw new Error(`Failed to update project with ID ${id}`);
    }

    const data = (await response.json()) as Project;
    return data;
};

// DELETE /projects/:id - Delete a project by ID
export const deleteProjectById = async (id: number): Promise<void> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/projects/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error(`Failed to delete project with ID ${id}`);
    }
};