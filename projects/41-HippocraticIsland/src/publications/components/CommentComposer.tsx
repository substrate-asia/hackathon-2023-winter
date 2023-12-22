import {
  CollectPolicyType,
  ContentFocus,
  ProfileOwnedByMe,
  PublicationId,
  useCreateComment,
} from '@lens-protocol/react-web';

import { upload } from '../../upload';
import { never } from '../../utils';
import { Textarea, Button } from '@chakra-ui/react';
import { BiArrowToRight } from 'react-icons/bi';

type CommentComposerProps = {
  publisher: ProfileOwnedByMe;
  publicationId: PublicationId;
};

export function CommentComposer({ publisher, publicationId }: CommentComposerProps) {
  const { execute: create, error, isPending } = useCreateComment({ publisher, upload });

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;

    const formData = new FormData(form);
    const content = (formData.get('content') as string | null) ?? never();

    await create({
      publicationId,
      content,
      contentFocus: ContentFocus.TEXT,
      locale: 'en',
      collect: {
        type: CollectPolicyType.NO_COLLECT,
      },
    });

    form.reset();
  };

  return (
    <form onSubmit={submit} style={{width: '100%'}}>
      <fieldset>

        <Textarea name="content"
          rows={3}
          required
          placeholder="Gm to your buddy"
          style={{ resize: 'none' }}
          disabled={isPending} />

        <Button leftIcon={<BiArrowToRight  />} colorScheme='teal' variant='solid' type="submit" disabled={isPending}>
          Comment
        </Button>

        {error && <pre>{error.message}</pre>}
      </fieldset>
    </form>
  );
}
