"use client";

import { FormEvent, useEffect, useState } from "react";

import { createProject } from "../../api/projects";
import { getAllUsers, type User } from "../../api/users";
import styles from "./add_project_form.module.css";

export default function AddProjectForm({ onProjectAdded }: { onProjectAdded?: () => void }) {
	{/* TODO: implement in part 2.3 */}
	const [projectName, setProjectName] = useState("");
	const [projectManagerId, setProjectManagerId] = useState("");
	const [projectDescription, setProjectDescription] = useState("");
	const [users, setUsers] = useState<User[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadUsers = async () => {
			try {
				setError(null);
				const allUsers = await getAllUsers();
				setUsers(allUsers);
			} catch (err) {
				const message = err instanceof Error ? err.message : "Failed to load users";
				setError(message);
			}
		};

		void loadUsers();
	}, []);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!projectName || !projectManagerId || !projectDescription) {
			setError("Please fill out all fields.");
			return;
		}

		try {
			setIsSubmitting(true);
			setError(null);

			await createProject({
				project_name: projectName,
				project_manager_id: Number(projectManagerId),
				project_description: projectDescription,
			});

			setProjectName("");
			setProjectManagerId("");
			setProjectDescription("");

			onProjectAdded?.();
		} catch (err) {
			const message = err instanceof Error ? err.message : "Failed to add project";
			setError(message);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form className={styles.form} onSubmit={handleSubmit}>
			<h2>Add Project</h2>

			<label className={styles.label} htmlFor="projectName">
				Project Name
			</label>
			<input
				id="projectName"
				className={styles.input}
				type="text"
				value={projectName}
				onChange={(event) => setProjectName(event.target.value)}
				placeholder="Enter project name"
			/>

			<label className={styles.label} htmlFor="projectManager">
				Project Manager
			</label>
			<select
				id="projectManager"
				className={styles.input}
				value={projectManagerId}
				onChange={(event) => setProjectManagerId(event.target.value)}
			>
				<option value="">Select a manager</option>
				{users.map((user) => (
					<option key={user.id} value={user.id}>
						{user.user_name}
					</option>
				))}
			</select>

			<label className={styles.label} htmlFor="projectDescription">
				Project Description
			</label>
			<textarea
				id="projectDescription"
				className={styles.input}
				value={projectDescription}
				onChange={(event) => setProjectDescription(event.target.value)}
				placeholder="Enter project description"
			/>

			<button className={styles.button} type="submit" disabled={isSubmitting}>
				{isSubmitting ? "Adding..." : "Add Project"}
			</button>

			{error && <p className={styles.error}>{error}</p>}
		</form>
	);
}