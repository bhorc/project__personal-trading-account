const permissionsPriority = {
    superAdmin: 9999,
    admin: 10,
    groupOwner: 9,
    member: 8,
    user: 7,
    nobody: 0,
    banned: -1,
}

export default permissionsPriority;