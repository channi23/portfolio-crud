import type { Project } from "$lib/types/project";

const STORAGE_KEY = "portfolio-projects";

export function loadProject():Project[]{
    if (typeof localStorage === 'undefined'){
        return[];
    }
    const storedProjects = localStorage.getItem(STORAGE_KEY);

    if(!storedProjects){
        return[];
    }

    return JSON.parse(storedProjects) as Project[];
}
export function saveProject(projects:Project[]):void{
    localStorage.setItem(STORAGE_KEY,JSON.stringify(projects));
}
