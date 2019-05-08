from textgenrnn import textgenrnn
import argparse
import random

parser = argparse.ArgumentParser(
    description="Neural Network Schmeural Network")
parser.add_argument(
    '-t',
    action='store',
    dest='temp',
    default=.4,
    type=float,
    help='Set temperature for text generation.'
)
parser.add_argument(
    '-n',
    action='store',
    dest='generate_n',
    default=1,
    type=int,
    help='Number of items to generate.'
)

parser.add_argument(
    '-b',
    action='store',
    dest='bs_model',
    default='models/shorten',
    help='Model for Bill Shorten.'
)

parser.add_argument(
    '-p',
    action='store',
    dest='pm_model',
    default='models/pm',
    help='Model for Scott Morrison.'
)
config = parser.parse_args()

bs = textgenrnn(
    'rnn/' + config.bs_model + "/textgenrnn_weights.hdf5",
    name="shorten",
    # weights_path='rnn/' + config.bs_model + "/textgenrnn_weights.hdf5",
    # vocab_path='rnn/' + config.bs_model + "/textgenrnn_vocab.json",
    # config_path='rnn/' + config.bs_model + "/textgenrnn_config.json"
)

pm = textgenrnn(
    'rnn/' + config.pm_model + "/textgenrnn_weights.hdf5",
    name="pm",
    # weights_path='rnn/' + config.pm_model + "/textgenrnn_weights.hdf5",
    # vocab_path='rnn/' + config.pm_model + "/textgenrnn_vocab.json",
    # config_path='rnn/' + config.pm_model + "/textgenrnn_config.json"
)


def get_question():
    lines = open('rnn/questions.txt').read().splitlines()
    question = random.choice(lines)
    return (question)


def format_line(str, model):
    if model == pm:
        speaker = 'MORRISON'
    elif model == bs:
        speaker = 'SHORTEN'
    else:
        speaker = model

    return speaker + ': ' + str + '\n\n'


def generate(model, prefix=''):
    result = model.generate(
        temperature=config.temp,
        prefix=prefix,
        max_gen_length=300 + len(prefix),
        return_as_list=True
    )
    return result[0]


def format_section(str):
    return '\n\n' + str + '\n'


def format_transcript(str):
    return '\n----Transcript----\n' + str + '--------------------\n'


def lastWords(str):
    words = str.split(" ")
    return ' '.join(words[2:4] + words[-3:])


def getAll():
    transcript = ''

    for x in range(0, config.generate_n):
        firstAnswerDecider = random.random()
        hasReply = random.random() < .75
        hasRetort = hasReply and random.random() > .85

        first = bs if firstAnswerDecider >= .5 else pm
        second = pm if first == bs else bs

        q = get_question()
        section = format_line(q, "QUESTION")

        seed = lastWords(q)
        a1_raw = generate(first, seed)
        a1_clean = a1_raw.replace(seed, '')

        section += format_line(a1_clean, first)

        # print('seed: ' + seed)
        # print('raw: ' + a1_raw)
        # print('clean: ' + a1_clean)
        # print('-------')

        if hasReply:
            seed = lastWords(a1_raw)
            a2_raw = generate(second, seed)
            a2_clean = a2_raw.replace(seed, '')

            section += format_line(a2_clean, second)

        if hasRetort:
            seed = lastWords(a2_raw)
            a3_raw = generate(first, seed)
            a3_clean = a3_raw.replace(seed, '')

            section += format_line(a2_clean, second)

        transcript += format_section(section)

        # just so we can watch as it generates
        # comment out when building big files or moving to production
        # print(section)

    return format_transcript(transcript)


print(getAll())
