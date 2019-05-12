Trained on speech transcripts from pm.gov website.
Built on top of initial 50 epoch word level set. Retrained for char level.

## model_cfg

- word_level: False
- rnn_size: 64
- rnn_layers: 2
- rnn_bidirectional: True
- max_length: 5
- max_words: 10000
- dim_embeddings: 10

## train_cfg

- new_model: True
- line_delimited: True
- num_epochs: 50
- gen_epochs: 5
- batch_size: 32
- train_size: 0.8
- dropout: 0.25
- max_gen_length: 30
- validation: True
- is_csv: False
