import { Command } from 'commander'
import { initCommand } from './commands/init.js'
import { runCommand } from './commands/run.js'

const program = new Command()

program
  .name('coursesmith')
  .description('AI-native framework for curriculum engineering')
  .version('1.0.0')

program
  .command('init')
  .description('Initialize a new CourseSmith project')
  .argument('[directory]', 'Project directory', '.')
  .action(initCommand)

program
  .command('run')
  .description('Run the configured pipeline')
  .option('-p, --pipeline <name>', 'Pipeline to run')
  .option('-o, --output <dir>', 'Output directory')
  .option('--dry-run', 'Validate configuration without executing')
  .action(runCommand)

program.parse(process.argv)
