from textgenrnn import textgenrnn
import argparse
import random

#  Regext to clean up crappy output:
#   \s([\',\’])\s(t|ll|m|v|s)
#   ->$1$2

#   \s([\.,\,])
#   ->$1

#   \si([\s,\'])
#   ->I$1

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
    default='models/shorten/interviews_over_speeches',
    help='Model for Bill Shorten.'
)

parser.add_argument(
    '-p',
    action='store',
    dest='pm_model',
    default='models/pm/speeches',
    help='Model for Scott Morrison.'
)
parser.add_argument(
    '-o',
    action='store',
    dest='output_file',
    default=False,
    help='fPath and name to save output file. If false, output will not be written to disk.'
)
config = parser.parse_args()

bs = textgenrnn(
    # 'rnn/' + config.bs_model + '/textgenrnn_weights.hdf5',
    weights_path='rnn/' + config.bs_model + '/textgenrnn_weights.hdf5',
    vocab_path='rnn/' + config.bs_model + '/textgenrnn_vocab.json',
    config_path='rnn/' + config.bs_model + '/textgenrnn_config.json'
)
# bs.load('rnn/' + config.bs_model +
#         '/textgenrnn_weights.hdf5', by_name=True)

pm = textgenrnn(
    # 'rnn/' + config.pm_model + '/textgenrnn_weights.hdf5',
    weights_path='rnn/' + config.pm_model + '/textgenrnn_weights.hdf5',
    vocab_path='rnn/' + config.pm_model + '/textgenrnn_vocab.json',
    config_path='rnn/' + config.pm_model + '/textgenrnn_config.json'
    # name="pm"
)

models = [
    {'model': bs, 'speaker': "Shorten", 'class_name': 'shorten'},
    {'model': pm, 'speaker': "Prime Minister", 'class_name': 'pm'}
]

interviewer = {
    'speaker': "Host",
    'class_name':  "question"
}


def get_question():
    lines = open('rnn/questions.txt').read().splitlines()
    return random.choice(lines)


def get_lines():
    return open('rnn/questions.txt').read().splitlines()


def generate(model_info, prefix=''):
    result = model_info['model'].generate(
        temperature=config.temp,
        prefix=prefix,
        # max_gen_length=150 + len(prefix),
        return_as_list=True
    )
    return result[0]


def get_seed(str):
    # todo | need a more robust solution
    # extract content from a string to use as a seed for the generator
    words = str.split(" ")
    return ' '.join(words[2:4] + words[-3:])


def wrap_in_tag(content, tag_type, class_name=''):
    if len(class_name) > 0:
        str = f"<{tag_type} class='{class_name}'>{content}</{tag_type}>"
    else:
        str = f"<{tag_type}>{content}</{tag_type}>"

    return str


def format_dialog_as_html(content, speaker, class_name='', speaker_tag='h2'):
    speaker_tag = wrap_in_tag(speaker, speaker_tag)
    content_tag = wrap_in_tag(content, 'p')
    section_content = speaker_tag + content_tag
    return wrap_in_tag(section_content, 'section', class_name)


def get_q_and_a(question=''):

    # todo | Could all be much DRYer though this function

    lines = []

    # q = get_question()
    seed = get_seed(question)
    content = format_dialog_as_html(
        question, interviewer['speaker'], interviewer['class_name'])
    lines.append({'seed': seed, 'content': content})

    #  randomly reverse the models list (or don't)
    #  to randomly choose who answers first
    if random.random() >= .5:
        models.reverse()

    #  random chance that the other model will offer an answer as well
    #  and, if the second model does offer an answer then
    #  a random chance that the first model will retort
    hasReply = random.random() < .75
    hasRetort = hasReply and random.random() > .85

    first_speaker = models[0]
    second_speaker = models[1]

    seed = get_seed(lines[-1]['seed'])
    raw_content = generate(first_speaker, seed).replace(seed, '')
    content = format_dialog_as_html(
        raw_content, first_speaker['speaker'], first_speaker['class_name'])

    lines.append({'seed': seed, 'content': content})

    # todo | just set number of dialog segments as int, so we can
    # todo | refactor all this if/else junk into a loop
    if hasReply:
        seed = get_seed(lines[-1]['seed'])
        raw_content = generate(second_speaker, seed).replace(seed, '')
        content = format_dialog_as_html(
            raw_content, second_speaker['speaker'], second_speaker['class_name'])

        lines.append({'seed': seed, 'content': content})

    if hasRetort:
        seed = get_seed(lines[-1]['seed'])
        raw_content = generate(first_speaker, seed).replace(seed, '')
        content = format_dialog_as_html(
            raw_content, first_speaker['speaker'], first_speaker['class_name'])

        lines.append({'seed': seed, 'content': content})

    return lines


def getAll():
    interview = []
    lines = get_lines()
    # for x in range(0, config.generate_n):
    for x in range(0, len(lines)):
        print(lines[x])
        dbug = f"Generating question/answer {x+1} of {len(lines)}."
        print(dbug)
        interview += get_q_and_a(lines[x])

    return interview


def save_output(content, path):
    save_file = open(path, 'w')
    save_file.write(content)


def start():
    conversation_items = getAll()
    html_output = ''
    for item in conversation_items:
        html_output += item['content'] + '\n'

    print(html_output)

    if (config.output_file):
        save_output(html_output, config.output_file)
        print('-----------------------------------------')
        print(f"Saved to file {config.output_file}")
        print('-----------------------------------------')


start()
