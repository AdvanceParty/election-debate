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
    name="shorten"
)

pm = textgenrnn(
    'rnn/' + config.pm_model + "/textgenrnn_weights.hdf5",
    name="pm"
)

models = [
    {'model': bs, 'speaker': "SHORTEN", 'class_name': 'shorten'},
    {'model': pm, 'speaker': "PRIME MINISTER", 'class_name': 'pm'}
]

interviewer = {
    'speaker': "INTERVIEWER",
    'class_name':  "interviewer"
}


def get_question():
    lines = open('rnn/questions.txt').read().splitlines()
    return random.choice(lines)


def generate(model_info, prefix=''):
    result = model_info['model'].generate(
        temperature=config.temp,
        prefix=prefix,
        max_gen_length=300 + len(prefix),
        return_as_list=True
    )
    return result[0]


def get_seed(str):
    # todo | need a more robust solution
    # extract content from a string to use as a seed for the generator
    words = str.split(" ")
    return ' '.join(words[2:4] + words[-3:])


def wrap_in_tag(content, tag_type, class_name=''):
    # tag = '<' + tag_type + ''

    # if len(class_name) > 0:
    #     tag += 'class="' + class_name + '"'
    # tag += '>\n' + content + '\n</' + tag_type + '>\n'
    # return tag
    return f"<{tag_type} class='{class_name}'>{content}</{tag_type}>"


def format_dialog_as_html(content, speaker, class_name='', speaker_tag='h2'):
    speaker_tag = wrap_in_tag(speaker, speaker_tag)
    section_content = speaker_tag + content
    return wrap_in_tag(section_content, 'section', class_name)


def get_q_and_a():

    # todo | Could all be much DRYer though this function

    lines = []

    q = get_question()
    seed = get_seed(q)
    content = format_dialog_as_html(q, 'INTERVIEWER', 'interviewer')
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
    for x in range(0, config.generate_n):
        dbug = f"Generating question/answer {x} of {config.generate_n}."
        print(dbug)
        interview.append(get_q_and_a())

    return interview


print(getAll())
