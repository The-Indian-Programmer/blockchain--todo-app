// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TodoList {
    Task[] public tasks;
    uint256 public taskCount;

    mapping(uint256 => address) public taskToOwner;
    mapping(uint256 => bool) public taskExists;

    event TaskCreated(uint256 id, string content, bool completed, uint256 timestamp, address owner);
    event TaskCompleted(uint256 id, bool completed);
    event TaskUpdated(uint256 id, string content);
    event TaskDeleted(uint256 id);

    struct Task {
        uint256 id;
        string content;
        bool completed;
        uint256 timestamp;
        bool isDeleted;
        address taskOwner;
    }

    function createTask(string memory _content) public {
        uint256 _id = taskCount;
        uint256 _timestamp = block.timestamp;

        tasks.push(Task(_id, _content, false, _timestamp, false, msg.sender));
        taskCount++;
        taskToOwner[_id] = msg.sender;
        taskExists[_id] = true;

        emit TaskCreated(_id, _content, false, _timestamp, msg.sender);
    }

    function getTaskById(uint256 _id) public view returns (Task memory) {
        require(taskExists[_id], "Task does not exist");
        return tasks[_id];
    }

    function getTasksByOwner(address _owner) public view returns (Task[] memory) {
        Task[] memory temporary = new Task[](tasks.length);
        uint counter = 0;
        for(uint i=0; i<tasks.length; i++) {
            if(taskToOwner[i] == _owner && tasks[i].isDeleted == false) {
                temporary[counter] = tasks[i];
                counter++;
            }
        }

        Task[] memory result = new Task[](counter);
        for(uint i=0; i<counter; i++) {
            result[i] = temporary[i];
        }
        return result;
    }

    function updateTask(uint256 _id, string memory _content) public {
        require(taskExists[_id], "Task does not exist");
        require(!tasks[_id].isDeleted, "Task has been deleted");
        require(tasks[_id].taskOwner == msg.sender, "Not task owner");
        tasks[_id].content = _content;

        emit TaskUpdated(_id, _content);
    }

    function completeTask(uint256 _id) public {
        require(taskExists[_id], "Task does not exist");
        Task storage task = tasks[_id];
        task.completed = true;

        emit TaskCompleted(_id, true);
    }

    function deleteTask(uint256 _id) public {
        require(taskExists[_id], "Task does not exist");
        require(tasks[_id].taskOwner == msg.sender, "Not task owner");
        Task storage task = tasks[_id];
        task.isDeleted = true;

        emit TaskDeleted(_id);
    }

    function toggleTaskCompleted(uint256 _id) public {
        require(taskExists[_id], "Task does not exist");
        require(!tasks[_id].isDeleted, "Task has been deleted");

        tasks[_id].completed = !tasks[_id].completed;

        emit TaskCompleted(_id, tasks[_id].completed);
    }

}
