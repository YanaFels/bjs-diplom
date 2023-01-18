'use strict'

//Выход из личного кабинета
const logout = new LogoutButton();
logout.action = () => ApiConnector.logout(response => {
    if (response.success) {
        location.reload();
    }
});

//Получение информации о пользователе
ApiConnector.current(response => {
    if(response.success) {
        ProfileWidget.showProfile(response.data);
    }
});

//Получение текущих курсов валюты
const rates = new RatesBoard();
function ratesUpdate() {
    ApiConnector.getStocks(response => {
        if(response.success) {
            rates.clearTable();
            rates.fillTable(response.data); 
        }
    });
}
setInterval(ratesUpdate(), 60000);

//Операции с деньгами
//Пополнение баланса
const manager = new MoneyManager();
manager.addMoneyCallback = replenBalance => ApiConnector.addMoney(replenBalance, response => {
    if(response.success) {
        ProfileWidget.showProfile(response.data);
        return manager.setMessage(true, 'Успешное пополнение счета на ' + replenBalance.amount + ' ' + replenBalance.currency);
    }
    return manager.setMessage(false, response.error);
    
});

//Конвертирование валюты
manager.conversionMoneyCallback = conversion => ApiConnector.convertMoney(conversion, response => {
    if(response.success) {
        ProfileWidget.showProfile(response.data);
        return manager.setMessage(true, 'Успешная конвертация суммы ' + conversion.fromAmount + ' ' + conversion.fromCurrency);
    }
    return manager.setMessage(false, 'Ошибка: ' + response.error);
});

//Перевод валюты
manager.sendMoneyCallback = currencyTransfer => ApiConnector.transferMoney(currencyTransfer, response => {
    if(response.success) {
        ProfileWidget.showProfile(response.data);
        return manager.setMessage(true, 'Успешный перевод ' + currencyTransfer.amount + ' ' + currencyTransfer.currency + ' получателю ' + currencyTransfer.to);
    }
    return manager.setMessage(false, 'Ошибка: ' + response.error);
});

//Работа с избранным
//Обновление списка избранных
const favorite = new FavoritesWidget;
ApiConnector.getFavorites(response => {
    if(response.success) {
        favorite.clearTable();
        favorite.fillTable(response.data);
        manager.updateUsersList(response.data);
        return;
    }
});

//Добавление пользователя в список избранных
favorite.addUserCallback = addUser => ApiConnector.addUserToFavorites(addUser, response => {
    if(response.success) {
        favorite.clearTable();
        favorite.fillTable(response.data);
        manager.updateUsersList(response.data);
        return favorite.setMessage(true, 'Успешно добавлен новый пользователь: ' + addUser.name);
    }
    return favorite.setMessage(false, 'Ошибка: ' + response.error);
});

//Удаление пользователя из списка избранных
favorite.removeUserCallback = removeUser => ApiConnector.removeUserFromFavorites(removeUser, response => {
    if(response.success) {
        favorite.clearTable();
        favorite.fillTable(response.data);
        manager.updateUsersList(response.data);
        return favorite.setMessage(true, 'Успешно удален пользователь: ' + removeUser);
    }
    return favorite.setMessage(false, 'Ошибка: ' + response.error);
});