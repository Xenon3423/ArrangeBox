class ArrangeBoxContainer {

  constructor() {
    this.container = document.getElementById('arrangeBoxContainer');

    this.initialAvailableValues = [];
    for (let i = 0; i < 10; i++) {
      this.initialAvailableValues.push(this.generateRandomString());
    }

    this.clickedListItem = null;
    this.createdButtonsBox = [];

    this.listAvailable = this.createList(this.initialAvailableValues);
    this.listSelected = this.createList();

    let boxContainer = document.createElement('div');
    boxContainer.className = 'arrange_box_main_container';

    boxContainer.append(this.createArrangeBoxArea(), this.createControlArea());
    this.container.append(boxContainer);
  }

  createArrangeBoxArea() {
    let arrangeBoxArea = document.createElement('div');
    arrangeBoxArea.className = 'arrange_box_area';

    let leftButtonsArea = this.createButtons(
      5,
      ['\u25B2', '\u25B3', '\u25BD', '\u25BC', '\u271A'],
      [
        () => this.upByAll(this.listAvailable),
        () => this.upByOne(this.listAvailable),
        () => this.downByOne(this.listAvailable),
        () => this.downByAll(this.listAvailable),
        () => this.addListElement(this.listAvailable)
      ],
      [true, true, true, true, false]
    );

    let leftBoxArea = this.createBoxArea('Доступные значения');

    let middleButtonsArea = this.createButtons(
      4,
      ['\u25B6', '\u25B7', '\u25C1', '\u25C0'],
      [
        () => this.moveAllToSelected(),
        () => this.moveOneToSelected(),
        () => this.moveOneToAvailable(),
        () => this.moveAllToAvailable(),
      ],
      [false, true, true, true]
    );

    let rightBoxArea = this.createBoxArea('Выбранные значения');

    let rightButtonsArea = this.createButtons(
      5,
      ['\u25B2', '\u25B3', '\u25BD', '\u25BC', '\u271A'],
      [
        () => this.upByAll(this.listSelected),
        () => this.upByOne(this.listSelected),
        () => this.downByOne(this.listSelected),
        () => this.downByAll(this.listSelected),
        () => this.addListElement(this.listSelected)
      ],
      [true, true, true, true, false]
    );

    arrangeBoxArea.append(leftButtonsArea, leftBoxArea, middleButtonsArea, rightBoxArea, rightButtonsArea);

    return arrangeBoxArea;
  }


  createButtons(amount, opSymbols, operations, isDisabled) {
    let buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'arrange_box_area_buttons';

    for (let i = 0; i < amount; i++) {
      let button = document.createElement('button');
      button.innerText = opSymbols[i];
      button.addEventListener('click', operations[i]);
      if (isDisabled[i]) {
        this.disableButton(button);
      }

      buttonsContainer.append(button);
      this.createdButtonsBox.push(button);
    }

    return buttonsContainer;
  }


  createBoxArea(labelText) {
    let boxContainer = document.createElement('div');
    boxContainer.className = 'box_area';

    let boxLabel = document.createElement('div');
    boxLabel.className = 'box_area_head';
    boxLabel.innerText = labelText;

    let boxSearch = document.createElement('div');
    boxSearch.className = 'box_search';
    let boxSearchInput = document.createElement('input');
    boxSearchInput.className = 'box_search_input';
    boxSearchInput.setAttribute('placeholder', 'Введите название');

    if (labelText == 'Доступные значения') {
      boxSearchInput.addEventListener('input', () => this.searchInput(this.listAvailable, boxSearchInput))
      boxSearch.append(boxSearchInput);
      boxContainer.append(boxLabel, boxSearch, this.listAvailable);
    } else {
      boxSearchInput.addEventListener('input', () => this.searchInput(this.listSelected, boxSearchInput))
      boxSearch.append(boxSearchInput);
      boxContainer.append(boxLabel, boxSearch, this.listSelected);
    }
    return boxContainer;
  }

  searchInput(targetedList, searchInput) {
    let searchText = searchInput.value.toLowerCase();

    for (let item of targetedList.children) {
      if (item.textContent.toLowerCase().includes(searchText)) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    }
  }

  createList(initialValues) {
    let boxItemsList = document.createElement('ul');
    boxItemsList.className = 'box_list';

    if (initialValues === undefined) return boxItemsList;

    for (let value of initialValues) {
      let listElem = document.createElement('li');
      listElem.innerText = value;
      listElem.addEventListener('click', () => this.clickListItem(listElem));
      boxItemsList.append(listElem);
    }

    return boxItemsList;
  }

  clickListItem(clickedListItem) {
    this.clickListItemDisableButton(clickedListItem);

    if (this.clickedListItem) {
      this.clickedListItem.classList.remove('clicked_list_item');
      if (this.clickedListItem === clickedListItem) {
        this.clickedListItem = null;
      } else {
        this.clickedListItem = clickedListItem;
        this.clickedListItem.classList.add('clicked_list_item');
      }
    } else {
      this.clickedListItem = clickedListItem;
      clickedListItem.classList.add('clicked_list_item');
    }
  }

  clickListItemDisableButton(clickedListItem) {
    let wasActiveItem = !!this.clickedListItem;

    let sortButtons = [];
    if (clickedListItem.parentElement == this.listAvailable) {
      for (let i = 0; i < 4; i++) {
        sortButtons.push(this.createdButtonsBox[i]);
      }
      this.undisableButton(this.createdButtonsBox[6]);
      this.disableButton(this.createdButtonsBox[7]);
    } else {
      for (let i = 0; i < 4; i++) {
        sortButtons.push(this.createdButtonsBox[i + 9]);
      }
      this.undisableButton(this.createdButtonsBox[7]);
      this.disableButton(this.createdButtonsBox[6]);
    }

    if (wasActiveItem) {
      if (this.clickedListItem === clickedListItem) {
        for (let button of sortButtons) {
          this.disableButton(button);
        }
        this.disableButton(this.createdButtonsBox[6], this.createdButtonsBox[7]);
      } else {
        if (clickedListItem.previousElementSibling) {
          this.undisableButton(sortButtons[0], sortButtons[1]);
        } else {
          this.disableButton(sortButtons[0], sortButtons[1]);
        }
        if (clickedListItem.nextElementSibling) {
          this.undisableButton(sortButtons[2], sortButtons[3]);
        } else {
          this.disableButton(sortButtons[2], sortButtons[3]);
        }
      }
    } else {
      if (clickedListItem.previousElementSibling) {
        this.undisableButton(sortButtons[0], sortButtons[1]);
      }
      if (clickedListItem.nextElementSibling) {
        this.undisableButton(sortButtons[2], sortButtons[3]);
      }
    }
  }

  disableMoveButton(targetedList) {
    let sortButtons = [];
    if (targetedList === this.listAvailable) {
      for (let i = 0; i < 4; i++) {
        sortButtons.push(this.createdButtonsBox[i]);
      }
    } else {
      for (let i = 0; i < 4; i++) {
        sortButtons.push(this.createdButtonsBox[i + 9]);
      }
    }

    if (!this.clickedListItem.previousElementSibling) {
      if (targetedList === this.listAvailable) {

      }
    }
  }

  disableButton(...targetButtons) {
    for (let button of targetButtons) {
      button.disabled = true;
      button.classList.add('disabled_button');
    }
  }

  undisableButton(...targetButtons) {
    for (let button of targetButtons) {
      button.disabled = false;
      button.classList.remove('disabled_button');
    }
  }




  upByAll(targetedList) {
    if (this.clickedListItem) {
      targetedList.firstElementChild.before(this.clickedListItem);
    }

    if (targetedList === this.listAvailable) {
      this.disableButton(this.createdButtonsBox[0], this.createdButtonsBox[1]);
      this.undisableButton(this.createdButtonsBox[2], this.createdButtonsBox[3]);
    } else {
      this.disableButton(this.createdButtonsBox[9], this.createdButtonsBox[10]);
      this.undisableButton(this.createdButtonsBox[11], this.createdButtonsBox[12]);
    }
  }

  upByOne(targetedList) {
    let upperSibling = this.clickedListItem.previousElementSibling;
    if (upperSibling) {
      upperSibling.before(this.clickedListItem);
    }

    this.undisableButton(this.createdButtonsBox[2], this.createdButtonsBox[3]);
    this.undisableButton(this.createdButtonsBox[11], this.createdButtonsBox[12]);
    if (!this.clickedListItem.previousElementSibling) {
      if (targetedList === this.listAvailable) {
        this.disableButton(this.createdButtonsBox[0], this.createdButtonsBox[1]);
      } else {
        this.disableButton(this.createdButtonsBox[9], this.createdButtonsBox[10]);
      }
    }
  }

  downByOne(targetedList) {
    let downerSibling = this.clickedListItem.nextElementSibling;
    if (downerSibling) {
      downerSibling.after(this.clickedListItem);
    }

    this.undisableButton(this.createdButtonsBox[0], this.createdButtonsBox[1]);
    this.undisableButton(this.createdButtonsBox[9], this.createdButtonsBox[10]);
    if (!this.clickedListItem.nextElementSibling) {
      if (targetedList === this.listAvailable) {
        this.disableButton(this.createdButtonsBox[2], this.createdButtonsBox[3]);

      } else {
        this.disableButton(this.createdButtonsBox[11], this.createdButtonsBox[12]);
      }
    }
  }

  downByAll(targetedList) {
    if (this.clickedListItem) {
      targetedList.lastElementChild.after(this.clickedListItem);
    }

    if (targetedList === this.listAvailable) {
      this.disableButton(this.createdButtonsBox[2], this.createdButtonsBox[3]);
      this.undisableButton(this.createdButtonsBox[0], this.createdButtonsBox[1]);
    } else {
      this.disableButton(this.createdButtonsBox[11], this.createdButtonsBox[12]);
      this.undisableButton(this.createdButtonsBox[9], this.createdButtonsBox[10]);
    }
  }

  addListElement(targetedList) {
    let newItemText = prompt('Введите значение:');
    if (newItemText) {
      let listItem = document.createElement('li');
      listItem.innerText = newItemText;
      listItem.addEventListener('click', () => this.clickListItem(listItem));
      targetedList.append(listItem);
    }
  }

  moveAllToSelected() {
    for (let i = this.listAvailable.children.length - 1; i >= 0; i--) {
      this.listSelected.append(this.listAvailable.children[i]);
    }

    if (this.clickedListItem) {
      this.clickedListItem.classList.remove('clicked_list_item');
      this.clickedListItem = null;
    }
    this.disableButton(
      this.createdButtonsBox[0], this.createdButtonsBox[1], this.createdButtonsBox[2],
      this.createdButtonsBox[3], this.createdButtonsBox[5],
      this.createdButtonsBox[6], this.createdButtonsBox[7]
    );
    this.undisableButton(this.createdButtonsBox[8]);
  }

  moveOneToSelected() {
    if (this.clickedListItem) {
      this.listSelected.append(this.clickedListItem);

      this.clickedListItem.classList.remove('clicked_list_item');
      this.clickedListItem = null;
      this.disableButton(
        this.createdButtonsBox[0], this.createdButtonsBox[1], this.createdButtonsBox[2],
        this.createdButtonsBox[3], this.createdButtonsBox[6], this.createdButtonsBox[7]
      );
      this.undisableButton(this.createdButtonsBox[8]);
      if (!this.listAvailable.children.length) {
        this.disableButton(this.createdButtonsBox[5]);
      }
    }
  }

  moveOneToAvailable() {
    if (this.clickedListItem) {
      this.listAvailable.append(this.clickedListItem);

      this.clickedListItem.classList.remove('clicked_list_item');
      this.clickedListItem = null;
      this.disableButton(
        this.createdButtonsBox[6], this.createdButtonsBox[7], this.createdButtonsBox[9],
        this.createdButtonsBox[10], this.createdButtonsBox[11], this.createdButtonsBox[12]
      );
      this.undisableButton(this.createdButtonsBox[5]);
      if (!this.listSelected.children.length) {
        this.disableButton(this.createdButtonsBox[8]);
      }
    }
  }

  moveAllToAvailable() {
    for (let i = this.listSelected.children.length - 1; i >= 0; i--) {
      this.listAvailable.append(this.listSelected.children[i]);
    }

    if (this.clickedListItem) {
      this.clickedListItem.classList.remove('clicked_list_item');
      this.clickedListItem = null;
    }
    this.undisableButton(this.createdButtonsBox[5]);
    this.disableButton(
      this.createdButtonsBox[6], this.createdButtonsBox[7], this.createdButtonsBox[8],
      this.createdButtonsBox[9], this.createdButtonsBox[10],
      this.createdButtonsBox[11], this.createdButtonsBox[12]
    );
  }

  createControlArea() {
    let controlArea = document.createElement('div');
    controlArea.className = 'control_area';

    let getLeftButton = document.createElement('button');
    getLeftButton.innerText = 'Получить доступные значения';
    getLeftButton.addEventListener('click', () => this.showListItems(this.listAvailable));

    let createNewBoxButton = document.createElement('button');
    createNewBoxButton.innerText = 'Создать новый ArrangeBox';
    createNewBoxButton.addEventListener('click', this.createNewArrangeBox);

    let resetButton = document.createElement('button');
    resetButton.innerText = 'Сброс значений';
    resetButton.addEventListener('click', () => this.resetToInitialState());

    let getRightButton = document.createElement('button');
    getRightButton.innerText = 'Получить выбранные значения';
    getRightButton.addEventListener('click', () => this.showListItems(this.listSelected));

    controlArea.append(getLeftButton, createNewBoxButton, resetButton, getRightButton);

    return controlArea;
  }

  resetToInitialState() {
    this.clickedListItem = undefined;
    for (let i = this.listSelected.children.length - 1; i >= 0; i--) {
      this.listSelected.children[i].remove();
    }
    for (let i = this.listAvailable.children.length - 1; i >= 0; i--) {
      this.listAvailable.children[i].remove();
    }

    for (let value of this.initialAvailableValues) {
      let listElem = document.createElement('li');
      listElem.innerText = value;
      listElem.addEventListener('click', () => this.clickListItem(listElem));
      this.listAvailable.append(listElem);
    }

    for (let button of this.createdButtonsBox) {
      this.disableButton(button);
    }
    this.undisableButton(
      this.createdButtonsBox[4],
      this.createdButtonsBox[5],
      this.createdButtonsBox[13]
    );
  }

  showListItems(targetList) {
    let itemsSet = [];
    for (let item of targetList.children) {
      itemsSet.push(item.textContent);
    }

    if (itemsSet.length) {
      itemsSet = itemsSet.join(', ');
      itemsSet = 'Полученные значения: ' + itemsSet;
    } else {
      itemsSet = 'Значений нет';
    }

    alert(itemsSet);
    console.log(itemsSet);
  }

  generateRandomString() {
    const charSet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charSetLength = charSet.length;
    for (let i = 0; i < 7; i++) {
      result += charSet.charAt(Math.floor(Math.random() * charSetLength));
    }
    return result;
  }

  createNewArrangeBox() {
    let newBox = new ArrangeBoxContainer();
  }

}

let arrangeBox = new ArrangeBoxContainer();