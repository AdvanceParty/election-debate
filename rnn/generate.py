from textgenrnn import textgenrnn
import argparse

parser = argparse.ArgumentParser(
    description="Generate content from one model")

parser.add_argument(
    '-o',
    action='store',
    dest='output_file',
    default=False,
    help='fPath and name to save output file. If false, output will not be written to disk.'
)
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


def save_output(content, path):
    save_file = open(path, 'w')
    save_file.write(content)


textgen = textgenrnn(
    weights_path=f"{config.model}/textgenrnn_weights.hdf5",
    vocab_path=f"{config.model}/textgenrnn_vocab.json",
    config_path=f"{config.model}/textgenrnn_config.json"
)


def generate(temp, prefix):
    return textgen.generate(
        1,
        temperature=temp,
        prefix=prefix,
        return_as_list=True
    )


def start():
    count = config.generate_n
    item_delimiter = '\n'
    print(f"Generating {count} items from {config.model}. Stand by.")
    if (count > 999):
        print("Generating that many items could take quite a while. Make a cuppa.")
    elif(count > 300):
        print("This may take a couple of minutes.")
    elif(count > 20):
        print("This may take a minute or two.")

    save_string = ''
    for x in range(0, count):
        print(f"Generating item {x+1} of {count}.")
        item = generate(config.temp, config.prefix)
        save_string += item[0] + '\n'

    print(save_string)

    if (config.output_file):
        save_output(save_string, config.output_file)
        print('-----------------------------------------')
        print(f"Saved to file {config.output_file}")
        print('-----------------------------------------')


start()
