query bringData {
allTodos {
name
id
}
}

query bringDataByKeyword($search: String!) {
allTodos(where: { name_contains: $search }) {
name
}
}

query bringDataorderby($order: [SortTodosBy!]) {
allTodos(sortBy: $order) {
name
}
}

query dataById($id: ID!) {
Todo(where: { id: $id }) {
name
}
}

mutation createATodo($newname: String!) {
createTodo(data: { name: $newname }) {
name
}
}

mutation deleteByID($idToDelete: ID!) {
deleteTodo(id: $idToDelete) {
name
}
}

mutation updateById($idToUpdate: ID!, $newname: String!) {
updateTodo(id: $idToUpdate, data: { name: $newname }) {
name
}
}

{ "search": "f",
"newname": "this is a new todo",
"idToDelete": "6030cb9f6da9b240fc43f005",
"id": "6030becc6da9b240fc43efff",
"order": ["name_DESC"]
}
