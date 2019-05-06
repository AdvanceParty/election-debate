from textgenrnn import textgenrnn
import argparse
import random
import logging
import sys
from io import StringIO

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
    '-m',
    action='store',
    dest='model_path',
    help='Name of trained model to use for new textrnn instance.'
)

parser.add_argument(
    '-o',
    action='store',
    dest='output_name',
    help='File name outputting saved models.'
)

config = parser.parse_args()


textgen = textgenrnn(
    name=config.output_name,
    weights_path=config.model_path + "/textgenrnn_weights.hdf5",
    vocab_path=config.model_path + "/textgenrnn_vocab.json",
    config_path=config.model_path + "/textgenrnn_config.json"
)


def gen(prefix):
    # if config.output_name is None:
    textgen.generate(prefix=prefix, temperature=config.temp)
    # else:
    #     textgen.generate_to_file(
    #         config.output_name, prefix=prefix, temperature=config.temp)


interviewer = "INTERVIEWER: "
shorten = "SHORTEN: "
pm = "PRIME MINISTER: "
crowd = "["

for x in range(0, config.generate_n):
    firstAnswerDecider = random.random()
    hasReply = random.random() < .75
    hasRetort = hasReply and random.random() > .85
    hasCrowd = random.random() > .80

    s1 = shorten if firstAnswerDecider >= .5 else pm
    s2 = pm if s1 == shorten else shorten

    gen(interviewer)
    gen(s1)

    if hasCrowd:
        gen(crowd)
        hasCrowd = False

    if hasReply:
        gen(s2)

    if hasCrowd:
        gen(crowd)
        hasCrowd = False

    if hasRetort:
        gen(s1)
