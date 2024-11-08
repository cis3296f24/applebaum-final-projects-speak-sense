import Page from '@/components/page'
import Section from '@/components/section'

const Statistics = () => (
	<Page>
		<Section>
			<h2 className='text-xl font-semibold'>Story</h2>

			<div className='mt-2'>
				<p className='text-zinc-600 dark:text-zinc-400'>
					&quot;statistics this&quot;
				</p>

				<br />

				<p className='text-sm text-zinc-600 dark:text-zinc-400'>
					<a href='https://twosentencestories.com/vision' className='underline'>
						oh this
					</a>
					statistic!
				</p>
			</div>
		</Section>
	</Page>
)

export default Statistics