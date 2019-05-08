from textgenrnn import textgenrnn
import argparse
import random

parser = argparse.ArgumentParser(
    description="Neural Network Schmeural Network")
parser.add_argument(
    '-t',
    action='store',
    dest='temp',
    default=.6,
    type=float,
    help='Set temperature for text generation.'
)
parser.add_argument(
    '-n',
    action='store',
    dest='generate_n',
    default=5,
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
    name="shorten"
)

pm = textgenrnn(
    name="pm",
    weights_path='rnn/' + config.pm_model + "/textgenrnn_weights.hdf5",
    vocab_path='rnn/' + config.pm_model + "/textgenrnn_vocab.json",
    config_path='rnn/' + config.pm_model + "/textgenrnn_config.json"
)


def generate(model):
    model.generate(
        interactive=True,
        top_n=config.generate_n,
        temperature=config.temp
    )


def start():
    firstAnswerDecider = random.random()
    if firstAnswerDecider >= .5:
        speaker = bs
        speaker_name = "SHORTEN"
    else:
        speaker = bs
        speaker_name = "BILL"

        print(speaker_name + " says:")
        generate(speaker)


start()
