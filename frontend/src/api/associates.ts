export type Associate = {
    id: number;
    project_id: number;
    associate_id: number;
};

// GET /associates/associate/:id - Get associates by project ID
export const getAssociatesByProjectId = async (projectId: number): Promise<Associate[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/associates/associate/${projectId}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch associates for project ID ${projectId}`);
    }
    const data = (await response.json()) as Associate[];
    return data;
};

// GET /associates/project/:id - Get projects by associate ID
export const getProjectsByAssociateId = async (associateId: number): Promise<Associate[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/associates/project/${associateId}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch projects for associate ID ${associateId}`);
    }
    const data = (await response.json()) as Associate[];
    return data;
};

// POST /associates - Create a new associate project relationship
export const createAssociate = async (associate: Omit<Associate, "id">): Promise<Associate> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/associates`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            project_id: associate.project_id,
            associate_id: associate.associate_id,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to create associate relationship");
    }

    const data = (await response.json()) as Associate;
    return data;
};

// DELETE /associates/:id - Delete an associate project relationship by ID
export const deleteAssociateById = async (id: number): Promise<void> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/associates/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error(`Failed to delete associate relationship with ID ${id}`);
    }
};
