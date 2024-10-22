import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    description: 'Вывести все элементы таблицы neuralnetworkmodels',
  })
  @Get('neural-network-models')
  public getNeuralNetworkModels() {
    return this.appService.getNeuralNetworkModels();
  }

  @ApiOperation({
    description: 'Посчитать количество элементов в таблице neuralnetworkmodels',
  })
  @Get('neural-network-models-count')
  public getNeuralNetworkModelsRowsCount() {
    return this.appService.getNeuralNetworkModelsRowsCount();
  }

  @ApiOperation({
    description: 'Вывести только названия алгоритмов (algorithm)',
  })
  @Get('algorithms')
  public getAlgorithms() {
    return this.appService.getAlgorithms();
  }

  @ApiOperation({
    description: 'Вывести названия алгоритмов (algorithm), которые начинаются со слова GPT',
  })
  @Get('gpt-algorithms')
  public getGptAlgorithms() {
    return this.appService.getGptAlgorithms();
  }

  @ApiOperation({
    description:
      'Вывести названия алгоритмов (algorithm), где название содержит 5 или менее символов',
  })
  @Get('algorithms-length-less-5')
  public getAlgorithmLengthLess5() {
    return this.appService.getAlgorithmLengthLess5();
  }

  @ApiOperation({
    description:
      'Вывести все элементы таблицы NeuralNetworkModels, отсортированные по названию алгоритма в порядке убывания',
  })
  @Get('sorted-algorithms')
  public getSortedAlgorithms() {
    return this.appService.getSortedAlgorithms();
  }

  @ApiOperation({
    description:
      'Посчитать количество элементов таблицы, где поле LanguagePair равно «русский-английский»',
  })
  @Get('count-russian-english')
  public getCountOfRussianEnglishModels() {
    return this.appService.getCountOfRussianEnglishModels();
  }

  @ApiOperation({
    description:
      'Посчитать количество всех различных значений поля languagepair, в результате вывести название languagepair и количество count_languagepair каждого названия',
  })
  @Get('count-language-pairs')
  public getCountOfLanguagePairs() {
    return this.appService.getCountOfLanguagePairs();
  }

  @ApiOperation({
    description:
      'Найти количество (values_count) всех типов поля speechpart и сами типы speechpart  таблицы morphology, вывести топ 3 по количеству',
  })
  @Get('top-speech-parts')
  public getTopSpeechParts() {
    return this.appService.getTopSpeechParts();
  }

  @ApiOperation({
    description: 'Найти общую сумму RuleExample для каждой части речи',
  })
  @Get('sum-rule-example')
  public getSumOfRuleExample() {
    return this.appService.getSumOfRuleExample();
  }

  @ApiOperation({
    description:
      'Найти сумму ruleexample (speechpart_example) для каждого типа поля speechpart, вывести только те, где сумма больше 10',
  })
  @Get('sum-ruleexample-by-speechpart')
  public getSumRuleExampleBySpeechPart() {
    return this.appService.getSumRuleExampleBySpeechPart();
  }

  @ApiOperation({
    description:
      'Для таблицы syntaxanalyse найти количество элементов с описанием «Простое предложение» или «Сложное предложение»',
  })
  @Get('count-simple-or-complex')
  public getCountSimpleOrComplexSentences() {
    return this.appService.getCountSimpleOrComplexSentences();
  }

  @ApiOperation({
    description: 'Вывести все строки, где genre равен «Роман», а textlanguage равен «Английский»',
  })
  @Get('romans-in-english')
  public getRomansInEnglish() {
    return this.appService.getRomansInEnglish();
  }

  @ApiOperation({
    description: 'Определить среднее количество слов в российских и английских романах',
  })
  @Get('average-wordcount')
  public getAverageWordCount() {
    return this.appService.getAverageWordCount();
  }

  @ApiOperation({
    description: 'Вывести произведение с наибольшим количеством слов',
  })
  @Get('largest-wordcount')
  public getLargestWordCount() {
    return this.appService.getLargestWordCount();
  }

  @ApiOperation({
    description:
      'Вывести все произведения, где количество слов в 2 раза больше минимального количества слов в романе',
  })
  @Get('double-min-words')
  public getDoubleMinWords() {
    return this.appService.getDoubleMinWords();
  }

  @ApiOperation({
    description: 'Вывести второе по размеру произведение',
  })
  @Get('second-largest')
  public async getSecondLargestText() {
    return await this.appService.getSecondLargestText();
  }

  @ApiOperation({
    description: 'Вывести все типы жанров',
  })
  @Get('genres')
  public async getAllGenres() {
    return await this.appService.getAllGenres();
  }

  @ApiOperation({
    description: 'Вывести все произведения, добавленные после 2020 года',
  })
  @Get('texts-after-2020')
  public async getTextsAfter2020() {
    return await this.appService.getTextsAfter2020();
  }

  @ApiOperation({
    description:
      'Вывести все произведения в жанре, который встречается реже всего и имеет наименьшее среднее количество слов',
  })
  @Get('rare-genre')
  public async getRareGenreTexts() {
    return await this.appService.getRareGenreTexts();
  }
}
