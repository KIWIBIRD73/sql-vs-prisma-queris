# About
Примеры SQL запросов и prisma запросов для разных задач.

#### Стандартная схема запроса
```sql
SELECT
  столбец1 AS новое_название,
  столбец2,
  АГРЕГАТ(столбец3)
FROM таблица
WHERE (условие1 OR условие2)
  AND условие3
GROUP BY столбец1, столбец2
HAVING АГРЕГАТ(столбец3) > 5
ORDER BY сортировка1, сортировка2
OFFSET 1 LIMIT 2
```

#### Базовые SQL операции
```sql
select

select 100

select '2024-09-12 14:00:00' as ВажнаяДата_Строка

select 90 / 3

select '3' + 10

-- Взаимодействие с таблицей
select * from TextBody
select count(*) from TextBody

-- Некоторые манипуляции с атрибутами
select WordCount, TextName from TextBody
select TextName, WordCount / 1000 as Тест from TextBody

-- Условие отбора
select TextName, WordCount from TextBody 
	where WordCount < 100000							-- =, <>, !=, <, >, <=, >=

select TextName, WordCount from TextBody
	where not (WordCount > 50000 and WordCount < 100000) 	-- + not

select TextName, WordCount, (WordCount * 2) as WordCount_edited from TextBody
	where (WordCount * 2) between 50000 and 100000

select TextName, WordCount from TextBody
	where WordCount > 400000 or WordCount < 25000

select count(*) from TextBody
	where WordCount > 400000 or WordCount < 25000

select * from TextBody
	where TextName != 'Война и мир'

select * from Lexicon
	where Frequency = (select min(Frequency) from Lexicon)

-- Сортировка
select * from Lexicon
	order by Frequency desc

-- Уникальные значения и отбор
select distinct Genre from TextBody

select Word, SpeechPart from Lexicon
	where not SpeechPart in ('Существительное', 'Глагол')	-- + not
	order by SpeechPart

select * from TextBody
	where TextName like '% % %'

-- Определённое количество записей
select * from TextBody
	offset 2 limit 2

select * from TextBody
	limit 2 offset 2

-- Группировка
--select * from NeuralNetworkModels
select LanguagePair, count(*) as Количество from NeuralNetworkModels
	where Algorithm like 'GPT%'
	group by LanguagePair
	--where Количество < 2 - не вариант
	having count(*) > 1

-- To be continued
```

#### Список задач
- Вывести все элементы таблицы neuralnetworkmodels
-	Посчитать количество элементов в таблице neuralnetworkmodels
-	Вывести только названия алгоритмов (algorithm)
-	Вывести названия алгоритмов (algorithm), которые начинаются со слова GPT
-	Вывести названия алгоритмов (algorithm), где название содержит 5 или менее символов
-	Вывести все элементы таблицы neuralnetworkmodels, отсортированные по названию алгоритма в порядке убывания
-	Посчитать количество элементов таблицы, где поле languagepair равно «русский-английский»
-	Посчитать количество всех различных значений поля languagepair, в результате вывести название languagepair и количество count_languagepair каждого названия
-	Найти количество (values_count) всех типов поля speechpart и сами типы speechpart  таблицы morphology, вывести топ 3 по количеству
-	 Найти общую сумму ruleexample
-	Найти сумму ruleexample (speechpart_example) для каждого типа поля speechpart, вывести только те, где сумма больше 10
-	Для таблицы syntaxanalyse найти количество элементов с описанием «Простое предложение» или «Сложное предложение»
-	 Для таблицы textbody вывести все строки, где genre равен «Роман», а textlanguage равен «Английский»
-	Определить среднее количество слов в российских и английских романах. Вывести поля genre, textlanguage, mean wordcount.
-	Вывести произведение с наибольшим количество слов.
-	Вывести все произведения, где количество слов в 2 раза больше минимального количества слов в романе
-	Вывести второе по размеру произведение.
-	Вывести все типы жанров.
-	Вывести все произведения, добавленные после 2020 года.
-	Найти жанр, который встречается реже всех и если таких несколько, содержит наименьшее среднее количество слов. Вывести все произведения в этом жанре.


# Get started
1. Запуск базы данных
    ```shell
    docker-compose up --build -d
    ```
2. Project start
    ```shell
    npm run start:dev
    ```