import {container, listItem} from './JobStepsForm.css';

export function JobStepsForm() {
  return (
    <div class={container}>
      <button class={listItem}>Step 1</button>
      <button class={listItem}>Step 2</button>
      <button class={listItem}>Step 3</button>
    </div>
  );
}
