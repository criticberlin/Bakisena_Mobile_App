import { CommonActions } from '@react-navigation/native';

/**
 * NavigationHelper provides utility functions to ensure consistent navigation 
 * behavior throughout the app.
 * 
 * This solves common navigation issues:
 * 1. Prevents navigation to screens that are already focused
 * 2. Properly handles navigation between stacks
 * 3. Prevents duplicate screen instances in the navigation stack
 */

/**
 * Safely navigate to a screen, ensuring proper behavior regardless of stack structure
 * 
 * @param navigation The navigation object from useNavigation()
 * @param screenName The name of the screen to navigate to
 * @param params Optional parameters to pass to the screen
 */
export const navigateTo = (navigation: any, screenName: string, params?: object) => {
  try {
    // Check if the navigation object exists
    if (!navigation) {
      console.error('Navigation object is undefined or null');
      return;
    }

    const currentRoute = navigation.getCurrentRoute?.();
    
    // If we're already on this screen, don't navigate again
    if (currentRoute?.name === screenName) {
      console.log(`Already on ${screenName} screen, skipping navigation`);
      return;
    }

    // Use CommonActions to navigate to ensure consistent behavior regardless of nested navigators
    navigation.dispatch(
      CommonActions.navigate({
        name: screenName,
        params
      })
    );
  } catch (error) {
    console.error(`Navigation error navigating to ${screenName}:`, error);
  }
};

/**
 * Reset the navigation stack and set the provided screen as the only screen
 * 
 * @param navigation The navigation object from useNavigation()
 * @param screenName The name of the screen to navigate to
 * @param params Optional parameters to pass to the screen
 */
export const resetStackTo = (navigation: any, screenName: string, params?: object) => {
  try {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: screenName, params }
        ],
      })
    );
  } catch (error) {
    console.error(`Navigation error resetting to ${screenName}:`, error);
  }
};

/**
 * Go back to the previous screen if possible
 * 
 * @param navigation The navigation object from useNavigation()
 */
export const goBack = (navigation: any) => {
  try {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  } catch (error) {
    console.error('Navigation error going back:', error);
  }
}; 