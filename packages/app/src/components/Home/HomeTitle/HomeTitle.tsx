import {
  mainDescription,
  mainDescriptionHighlight,
  mainTitle,
  mainTitleContainer,
} from './HomeTitle.css';
import {Icon} from '#ui/components/Icon';

export function HomeTitle() {
  return (
    <div class={mainTitleContainer}>
      <h1 class={mainTitle}>
        <Icon name={'account_tree'} size={'lg'} />
        PipelineUI
      </h1>
      <span class={mainDescription}>
        <span class={mainDescriptionHighlight}>Visual workflow</span> for GitHub
      </span>
    </div>
  );
}
