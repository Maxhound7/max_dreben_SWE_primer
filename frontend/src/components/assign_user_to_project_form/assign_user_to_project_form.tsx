"use client";

import { FormEvent, useEffect, useState } from "react";

import { createAssociate } from "../../api/associates";
import { getAllProjects, type Project } from "../../api/projects";
import { getAllUsers, type User } from "../../api/users";
import styles from "./assign_user_to_project_form.module.css";

export default function AssignUserToProjectForm({
	onAssignmentAdded,
}: {
	onAssignmentAdded?: () => void;
}) {
	{/* TODO: implement in part 2.3 */}
	const [projectId, setProjectId] = useState("");
	const [associateId, setAssociateId] = useState("");
	const [projects, setProjects] = useState<Project[]>([]);
	const [users, setUsers] = useState<User[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadFormData = async () => {
			try {
				setError(null);

				const [allProjects, allUsers] = await Promise.all([
					getAllProjects(),
					getAllUsers(),
				]);

				setProjects(allProjects);
				setUsers(allUsers);
			} catch (err) {
				const message = err instanceof Error ? err.message : "Failed to load form data";
				setError(message);
			}
		};

		void loadFormData();
	}, []);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!projectId || !associateId) {
			setError("Please select both a project and an associate.");
			return;
		}

		try {
			setIsSubmitting(true);
			setError(null);

			await createAssociate({
				project_id: Number(projectId),
				associate_id: Number(associateId),
			});

			setProjectId("");
			setAssociateId("");

			onAssignmentAdded?.();
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Failed to assign user to project";
			setError(message);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form className={styles.form} onSubmit={handleSubmit}>
			<h2>Assign User to Project</h2>

			<label className={styles.label} htmlFor="project">
				Project
			</label>
			<select
				id="project"
				className={styles.input}
				value={projectId}
				onChange={(event) => setProjectId(event.target.value)}
			>
				<option value="">Select a project</option>
				{projects.map((project) => (
					<option key={project.id} value={project.id}>
						{project.project_name}
					</option>
				))}
			</select>

			<label className={styles.label} htmlFor="associate">
				Associate
			</label>
			<select
				id="associate"
				className={styles.input}
				value={associateId}
				onChange={(event) => setAssociateId(event.target.value)}
			>
				<option value="">Select an associate</option>
				{users.map((user) => (
					<option key={user.id} value={user.id}>
						{user.user_name}
					</option>
				))}
			</select>

			<button className={styles.button} type="submit" disabled={isSubmitting}>
				{isSubmitting ? "Assigning..." : "Assign User"}
			</button>

			{error && <p className={styles.error}>{error}</p>}
		</form>
	);
}