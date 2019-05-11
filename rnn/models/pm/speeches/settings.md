Trained on speech transcripts from pm.gov website and http://sjm.ministers.treasury.gov.au/speech/017-2018/

## model_cfg

- word_level: False
- rnn_size: 128
- rnn_layers: 2
- rnn_bidirectional: False
- max_length: 40
- max_words: 10000
- dim_embeddings: 100

## train_cfg

- new_model: True
- line_delimited: False
- num_epochs: 50
- gen_epochs: 5
- batch_size: 1024
- train_size: 0.8
- dropout: 0.2
- max_gen_length: 300
- validation: True
- is_csv: False
