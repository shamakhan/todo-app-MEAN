# Todo App built in MEAN Stack

## Set up
- Copy the .env.example file in an .env file
- Add proper config details in the .env file

To install all the server dependencies, in the root folder, run
```bash
npm install
```

Then to start the server, run
```bash
npm start
```

If it ran successfully then you should see output similar to this in the console,
```bash
Server started on http://localhost:3000
Db connected successfully. mongodb://localhost:27017/stackhackTodo
```

Here,
**appUrl** will be whatever you set for in the .env file, default is http://localhost.
Similar for **appPort**, default is 3000


### Client side app
I have built and committed the client side app bundle. The bundle files are served statically from the public folder. If you still want to rebuild the assets then you can cd into the client-app folder and run ng build. Make sure you have the angular-cli tool available for it to work

## Usage
You can visit the path which you see in the console in which you app is running, http://localhost:3000.

### Register / Login
- We have a landing page, from there you can find two buttons at the top, namely, Register and Login. From there you can register and login respectively.
- Login with google oauth is also provided. Or you can register with our app, providing email, username, password.
- Once successfully logged in, you'll be redirected to the dashboard page, where you can start managing your tasks.

### Adding Tasks
- On dashboard, we can see three boards, namely, Open, In Progress and Completed, for holding tasks having the same status.
- To add a task to a particular board, you can see a plus(+) icon at the top right of the board header, clicking on which should open a modal form, where you can fill in the task details and save.
- Once saved the task should appear in the respective board. Task will get added at the last in the board and will have the highest value order.

### Task ordering
- The task at the top of the list has the lowest order among other tasks in the same board, which can be changed by reordering the items in the board.
- Tasks can also be moved across boards, either by dragging or by changing there status.

### Editing and Viewing tasks
- Tasks can be edited or deleted.
- On clicking on the task card, it's details will be shown in a modal, which also allows editing the task.

### Filtering tasks
- At the top, you can see different filters.
- First one is the date filter, which can be either Due date or created date, it would filter and show only those tasks which have been created on or are due on the selected date.
- Second one is the labels filter, any task containing the selected filter will be shown, rest will be hidden.
- Third one is the search filter based on task title and description (case-insensitive).
- You can also clear your filters once done viewing with the clear button provided at the right.

### Archiving tasks
- Only completed tasks can be archived.
- You can either archive tasks individually by clicking on archive icon on individual task card or archive all completed tasks by clicking on the archive icon in the completed task group header.
- There's also a checkbox provided beside it, which if checked will also show the archived tasks. By default, it's unchecked, which would hide any archived tasks from the completed board. Note that any task that has been archived and moved to a board other than completed will be visible. Archived tasks will only be hidden if they have status as completed and the show archive checkbox is unchecked.





