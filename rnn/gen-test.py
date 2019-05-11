from textgenrnn import textgenrnn
import argparse

parser = argparse.ArgumentParser(
    description="Test content generation with specific model")

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
    '-p',
    action='store',
    dest='prefix',
    default='',
    help='Content prefix.'
)

parser.add_argument(
    '-m',
    action='store',
    dest='model',
    help='Model to use for content generation.'
)

config = parser.parse_args()

textgen = textgenrnn(
    weights_path=f"{config.model}/textgenrnn_weights.hdf5",
    vocab_path=f"{config.model}/textgenrnn_vocab.json",
    config_path=f"{config.model}/textgenrnn_config.json"
)

textgen.generate(
    config.generate_n,
    temperature=config.temp,
    prefix=config.prefix,
)
