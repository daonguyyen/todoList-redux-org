import React, { Component } from 'react'
import './App.css';
import TaskForm from './components/TaskForm';
import Control from './components/Control';
import TaskList from './components/TaskList';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      isDisplayForm: false, //Buoc 1
      taskEditing: null,
      filter : {
        name : '',
        status : -1
      },
      keyword : '',
      sort : {  //Mac dinh: sort theo name va tang dan
        by : 'name',
        value : 1
      }
    }
  }

  componentDidMount() {
    if (localStorage && localStorage.getItem('tasks')) {
      var taskItems = JSON.parse(localStorage.getItem('tasks'));
      this.setState({
        tasks: taskItems
      })
    }
  }



  // onGenerateData = () => {
  //   var tasks = [
  //     {
  //       id : this.generateID(),
  //       name : 'An sang',
  //       status : true
  //     },
  //     {
  //       id : this.generateID(),
  //       name : 'Di boi',
  //       status : false
  //     },
  //     {
  //       id : this.generateID(),
  //       name : 'Di ngu',
  //       status : true
  //     }
  //   ];
  //   this.setState({
  //     tasks : tasks //Luu vao state nhung khi refresh trinh duyet, data se mat di
  //   })
  //   localStorage.setItem('tasks', JSON.stringify(tasks))
  // }

  s4() { //Ham random string
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }

  generateID() {
    return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4() + this.s4();
  }

  //Buoc 5 : viet ham bat su kien toggle form
  onToggleForm = () => { //Them task
    if(this.state.isDisplayForm && this.state.taskEditing !== null){
      this.setState({
        isDisplayForm: true,
        taskEditing : null
      })
    }else{
      this.setState({
        isDisplayForm: !this.state.isDisplayForm, //Buoc 6: set state cho trang thai cua form
        taskEditing : null
      })
    }
    
  }
//Ham dong form cap nhat
  onCloseForm = () => {
    this.setState({
      isDisplayForm: false
    })
  }

  onShowForm = () => {
    this.setState({
      isDisplayForm: true
    })
  }

  onSubmit = (data) => {
    var { tasks } = this.state
    //Kiem tra da co id chua de tien hanh them hoac cap nhat
    if(data.id === '' ) { 
      data.id = this.generateID()
      tasks.push(data);
    }else {
      //Editing: tim id va replace vao vi tri cua task
      var index = this.findIndex(data.id)
      tasks[index] = data
      
    }
    this.setState({
      tasks: tasks,
      taskEditing : null
    })
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }

  onUpdateStatus = (id) => {
    var { tasks } = this.state
    var index = this.findIndex(id)
    if (index !== -1) {
      tasks[index].status = !tasks[index].status
      this.setState({
        tasks: tasks
      })
      localStorage.setItem('tasks', JSON.stringify(tasks))
    }

  }

  //Sau nay su dung thu vien lodash de thay the ham tim kiem index

  findIndex = id => {
    var { tasks } = this.state //lay danh sach cac task ra
    var result = -1
    tasks.forEach((task, index) => {
      if (task.id === id) {
        console.log(index)
        result = index;
      }
    })
    return result
  }

  onDelete = (id) => {
    var { tasks } = this.state
    var index = this.findIndex(id)
    if (index !== -1) {
      tasks.splice(index, 1)
      this.setState({
        tasks: tasks
      })
      localStorage.setItem('tasks', JSON.stringify(tasks))
    }
    this.onCloseForm()
  }

  onUpdate = id => {
    var { tasks } = this.state
    var index = this.findIndex(id)
    var taskEditing = tasks[index]
    this.setState({
      taskEditing: taskEditing
    })
    this.onShowForm()
  }

  onFilter = (filterName, filterStatus) => {
    console.log(filterName + '-' + filterStatus)
    filterStatus = +filterStatus //filterStatus = parseInt(filterStatus)
    this.setState({
      filter : {
        name : filterName.toLowerCase(),
        status : filterStatus
      }
    })
  }

  onSearch = (keyword) => {
    this.setState({
      keyword : keyword
    })
  }

  onSort = sort => {
    this.setState({
      sort : sort
    })
  }

  render() {

    var { tasks, isDisplayForm /** buoc 2*/, taskEditing, filter, keyword, sort } = this.state

    if(filter){
      if(filter.name) {
        tasks = tasks.filter((task) => {
          return task.name.toLowerCase().indexOf(filter.name) !== -1;
        })
      }
      tasks = tasks.filter((task) => {
        if(filter.status === -1){
          return task
        }else{
          return task.status === (filter.status === 1 ? true : false )
        }
      })
    }

    if(keyword){
      tasks = tasks.filter((task) => {
        return task.name.toLowerCase().indexOf(keyword) !== -1;
      })
    }
    
    //Sort
    if(sort.by === 'name'){
      tasks.sort((a, b) => {
        if(a.name > b.name) return sort.value;
        else if (a.name < b.name) return -sort.value;
        else return 0;
      })
    }else {
      tasks.sort((a, b) => {
        if(a.status > b.status) return -sort.value;
        else if (a.status < b.status) return sort.value;
        else return 0;
      })
    }

    var elmTaskForm = isDisplayForm ?
      <TaskForm 
                onSubmit={this.onSubmit} 
                onCloseForm={this.onCloseForm} 
                task={taskEditing}
                /> : ''; //Buoc 3 : kiem tra dieu kien

    return (
      <div className="container">
        <div className="text-center">
          <h1>Quản Lý Công Việc</h1>
          <hr />
        </div>
        <div className="row">
          <div className={isDisplayForm ? 'col-xs-4 col-sm-4 col-md-4 col-lg-4' : ''}>
            {/* Form */}
            {elmTaskForm}
          </div>
          <div className={isDisplayForm ? 'col-xs-8 col-sm-8 col-md-8 col-lg-8' : 'col-xs-12 col-sm-12 col-md-12 col-lg-12'}>
            <button type="button" className="btn btn-primary mr-5" onClick={this.onToggleForm}>  {/* Buoc 4: bat su kien onClick */}
              <span className="fa fa-plus mr-5" />Thêm Công Việc
            </button>
            {/* <button type="button" className="btn btn-danger" onClick={this.onGenerateData}>
              Generate Data
            </button> */}
            {/* Search - Sort */}
            <Control onSearch={this.onSearch} onSort={this.onSort}/>
            {/* List */}
            <TaskList 
                    taskList={tasks} 
                    onUpdateStatus={this.onUpdateStatus} 
                    onDelete={this.onDelete}
                    onUpdate={this.onUpdate} 
                    onFilter={this.onFilter}/>
          </div>
        </div>
      </div>

    );
  }
}
