export interface UserDetailsModel {
    id?: number
    firstName: string
    lastName: string
    emailAddress: string
    password: string
    phoneNum?: string
    isSuperUser?: boolean
}