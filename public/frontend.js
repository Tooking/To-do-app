import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.7.8/dist/vue.esm.browser.min.js'

Vue.component('loader', {
    template: `
            <div style="display: flex; justify-content: center; align-items: center;">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden"></span>
                </div>
            </div>
                `
}) 

new Vue({
    el: '#app',
    data(){
        return {
            loading: false,
            form: {
                name: '',
                value: ''
            },
        tasks: []
        }
    },
    computed:{
        canCreate(){
            return this.form.value.trim() && this.form.name.trim()
        }
    },
    methods: {
        async createTask() {
            const {...task} = this.form

            const newTask = await request('https://to-do-app-ten-plum.vercel.app/api/tasks', 'POST', task)

            this.tasks.push(newTask)

            this.form.name = this.form.value = '';
        },
        async markTask(id){
            const task = this.tasks.find(t => t.id === id)
            const updated = await request(`https://to-do-app-ten-plum.vercel.app/api/tasks/:${id}`, 'PUT', {
                ...task, 
                marked: true
            })
            task.marked = updated.marked;
            
        },
        async removeTask(id){
            await request(`https://to-do-app-ten-plum.vercel.app/api/tasks/${id}`, 'DELETE')
            this.tasks = this.tasks.filter(t => t.id !== id)
        }
    },
    async mounted(){
        this.loading = true;
        this.tasks = await request('https://to-do-app-ten-plum.vercel.app/api/tasks');
        this.loading = false;
    }
})


async function request(url, method = "GET", data = null){
    try{
        const headers = {}
        let body

        if(data){
            headers['Content-Type'] = 'application/json'
            body = JSON.stringify(data)
        }

        const response = await fetch(url, {
            method,
            headers,
            body
        })
        return await response.json()
    }catch(e){
        console.warn("Error:", e.message)
    }
}