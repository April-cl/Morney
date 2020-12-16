const localStorageName = 'tabList'

type Tag = {
    id: string
    name: string
}
type TagListModel = {
    data: Tag[]
    fetch: () => Tag[]
    create: (name: string) => 'success' | 'duplicated'
    save: () => void
}

const tagListModel: TagListModel = {
    data: [],
    fetch() {
        this.data = JSON.parse(window.localStorage.getItem(localStorageName) || '[]')
        return this.data
    },
    create(name) {
        const names = this.data.map(item => item.name)
        if (names.indexOf(name) >= 0) { return 'duplicated' }
        this.data.push({ id: name, name: name })
        this.save()
        return 'success'
    },
    save() {
        window.localStorage.setItem(localStorageName, JSON.stringify(this.data))
    }
}

export default tagListModel