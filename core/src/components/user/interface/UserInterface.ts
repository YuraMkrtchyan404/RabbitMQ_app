export interface UserInterface {
    getName(): string | undefined;
    setName(v: string): void;
    getSurname(): string | undefined;
    setSurname(v: string): void;
    getId(): number | undefined;
    setId(v: number): void;
    getEmail(): string | undefined;
    setEmail(v: string): void;
    getUser(): Promise<any>;
    getUsers(): Promise<any[]>;
    saveUser(): Promise<any>;
    updateUser(): Promise<any>;
    deleteUser(): Promise<any>;
    findUserByEmail(): Promise<any>;
  }
  