const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("TodoList", function () {
    let todoList;
    let owner;
    let addr1;
    let addr2;
    let task;

    beforeEach(async () => {
        const TodoList = await ethers.getContractFactory("TodoList");
        [owner, addr1, addr2] = await ethers.getSigners();
        todoList = await TodoList.deploy();
        await todoList.deployed();
    });


    beforeEach(async () => {
        const content = "Buy milk";
        await todoList.createTask(content);
        task = await todoList.tasks(0);
    })

    // before("getTaskById", async () => {
    //     const content = "Buy milk";
    //     await todoList.createTask(content);
    //     task = await todoList.tasks(0);
    // })

    // before("updateTaskContent", async () => {
    //     const content = "Buy milk";
    //     await todoList.createTask(content);
    //     task = await todoList.tasks(0);
    // })



    describe("createTask", function () {
        it("should create a new task", async () => {
            const content = "Buy milk";
            await todoList.createTask(content);
            task = await todoList.tasks(0);
            assert.equal(task.id.toNumber(), 0);
            assert.equal(task.content, content);
            assert.equal(task.completed, false);
            assert.equal(task.timestamp.toNumber() > 0, true);
            assert.equal(task.isDeleted, false);
            assert.equal(await todoList.taskCount(), 2);
        });
    });

    describe("getTaskById", function () {
        it("should return the task by id", async () => {
            const result = await todoList.getTaskById(0);
            assert.equal(result.id.toNumber(), task.id);
            assert.equal(result.content, task.content);
            assert.equal(result.completed, task.completed);
            assert.equal(result.timestamp.toNumber(), task.timestamp);
            assert.equal(result.isDeleted, task.isDeleted);
        });

        it("should revert if task does not exist", async () => {
            await expect(todoList.getTaskById(2)).to.be.revertedWith(
                "Task does not exist"
            );
        });
    });

    describe("getTasksByOwner", function () {
        it("should return all tasks by owner", async () => {
            const content = "Do laundry";
            await todoList.createTask(content);
            await todoList.connect(addr1).createTask("Go to gym");
            const tasks = await todoList.getTasksByOwner(owner.address);
            assert.equal(tasks[0].content, task.content);
            assert.equal(tasks[1].content, content);
        });

        it("should return empty array if no tasks found for owner", async () => {
            const tasks = await todoList.getTasksByOwner(addr2.address);
            assert.equal(tasks.length, 0);
        });
    });

    describe("updateTaskContent", function () {
        it("should update the content of the task", async () => {
            const newContent = "Buy eggs";
            await todoList.updateTask(task.id, newContent);
            task = await todoList.tasks(0);
            assert.equal(task.content, newContent);
        });

        it("should revert if task does not exist", async () => {
            await expect(todoList.updateTask(2, "Do something")).to.be.revertedWith(
                "Task does not exist"
            );
        });

        it("should revert if task is deleted", async () => {
            await todoList.deleteTask(task.id);
            await expect(todoList.updateTask(task.id, "Do something")).to.be.revertedWith(
                "Task has been deleted"
            );
        });
    });

    describe("toggleTaskCompleted", function () {
        it("should toggle the completed status of the task", async () => {
            await todoList.toggleTaskCompleted(task.id);
            task = await todoList.tasks(0);
            assert.equal(task.completed, true);
        });
    });

    describe("events", function () {
        it("should emit TaskCreated event when a new task is created", async () => {
            const content = "Buy groceries";
            const tx = await todoList.createTask(content);
            const receipt = await tx.wait();
            // Ensure the task created event is emitted
            const event = receipt.events[0];
            expect(event.event).to.equal("TaskCreated");
            expect(event.args.id.toNumber()).to.equal(1); // the first task created should have ID 0
            expect(event.args.content).to.equal(content);
            expect(event.args.completed).to.equal(false);
            expect(event.args.timestamp.toNumber()).to.be.a("number");
            expect(event.args.owner).to.equal(owner.address);
          });
          
      
        it("should emit TaskCompleted event when a task is completed", async () => {
          const taskID = await todoList.createTask("Do something");
        //   const tx = await todoList.toggleTaskCompleted(taskID);
        //   const event = tx.events[0];
      
        //   expect(event.event).to.equal("TaskCompleted");
        //   expect(event.args.id.toNumber()).to.equal(taskID);
        //   expect(event.args.completed).to.be.true;
        });
      
        it("should emit TaskUpdated event when a task is updated", async () => {
          const taskID = await createTask("Do something");
          const tx = await todoList.updateTask(taskID, "Do something else");
          const event = tx.events[0];
      
          expect(event.event).to.equal("TaskUpdated");
          expect(event.args.id.toNumber()).to.equal(taskID);
          expect(event.args.content).to.equal("Do something else");
        });
      
        it("should emit TaskDeleted event when a task is deleted", async () => {
          const taskID = await createTask("Do something");
          const tx = await todoList.deleteTask(taskID);
          const event = tx.events[0];
      
          expect(event.event).to.equal("TaskDeleted");
          expect(event.args.id.toNumber()).to.equal(taskID);
        });
      });
      
    
});