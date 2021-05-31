export interface FontAwesomeLibrary {
    icons: IconPacks;
}

export interface IconPacks {
    fas: string[];
    far: string[];
    fab: string[];
}

export interface Icon {
    prefix: string;
    name: string;
}
